import {
  HighOrderObserver,
  RecorderPreset,
  Recorder,
  Observers,
  ObserverName,
  ElementX
} from './models/index'
import { _log, _warn, _now, _throttle } from './tools/helpers'
import { RECORDER_DEFAULT_OPTIONS } from './constants'

import ConsoleObserverClass from './observers/console'
import EventObserverClass from './observers/event'
import HttpObserverClass from './observers/http'
import DOMMutationObserverClass from './observers/mutation'
import JSErrorObserverClass from './observers/js-error'
import HistoryObserverClass from './observers/history'
import MouseObserverClass from './observers/mouse'

import NikonD7000 from './tools/NikonD7000'

export default class RecorderClass implements Recorder {
  public observers: Observers = {
    mutation: null,
    console: null,
    event: null,
    mouse: null,
    error: null,
    history: null,
    http: null
  }
  public options: RecorderPreset = RECORDER_DEFAULT_OPTIONS
  public trail: any[] = []
  public recording: boolean = false
  private baseTime: number = 0

  public maxTimeSpan: number = 60000 // limit time of recording
  private lastSnapshot: { time: number; index: number } = {
    time: 0,
    index: 0
  }

  constructor(options?: RecorderPreset) {
    if (options) {
      this.options = { ...this.options, ...options }
    }

    const {
      mutation,
      history,
      http,
      event,
      error,
      console: consoleOpt,
      mouse
    } = this.options

    this.observers = {
      console: new ConsoleObserverClass(consoleOpt),
      mutation: new DOMMutationObserverClass(mutation),
      event: new EventObserverClass(event),
      mouse: new MouseObserverClass(mouse),
      http: new HttpObserverClass(http),
      error: new JSErrorObserverClass(error),
      history: new HistoryObserverClass(history)
    }

    Object.keys(this.observers).forEach((observerName: ObserverName) => {
      const observer = this.observers[observerName]

      observer.$on('observed', this.pushToTrail.bind(this))
    })
  }

  public observeScroll = (ele: ElementX) => {
    if (ele) {
      ele.addEventListener(
        'scroll',
        _throttle((this.observers.event as any).getScrollRecord)
      )
    } else {
      _warn("Element doesn't existsed!")
    }
  }

  private pushToTrail = (record): void => {
    if (!this.recording) return

    const thisRecordTime = _now() - this.baseTime

    record = { t: thisRecordTime, ...record }
    const {
      time: lastSnapshotTime,
      index: lastSnapshotIndex
    } = this.lastSnapshot

    if (thisRecordTime - lastSnapshotTime >= this.maxTimeSpan / 2) {
      if (lastSnapshotIndex !== 0) {
        this.trail = this.trail.slice(lastSnapshotIndex)
      }

      const snapshotRecord = this.getSnapshotRecord()
      this.trail.push(snapshotRecord)
    }

    this.trail.push(record)
  }

  private getSnapshotRecord() {
    this.lastSnapshot.time = _now() - this.baseTime
    this.lastSnapshot.index = this.trail.length

    const { clientWidth: w, clientHeight: h } = document.documentElement
    const { x, y } = (this.observers.event as any).getScrollPosition()

    return {
      t: this.lastSnapshot.time,
      type: 'snapshot',
      scroll: { x, y },
      resize: {
        w,
        h
      },
      snapshot: NikonD7000.takeSnapshotForPage()
    }
  }

  public start = (): void => {
    if (this.recording) {
      _warn('record already started')
      return
    }

    this.recording = true

    this.trail[0] = this.getSnapshotRecord()

    this.baseTime = _now()

    Object.keys(this.observers).forEach(observerName => {
      if (this.options[observerName]) {
        ;(this.observers[observerName] as HighOrderObserver).install()
      }
    })
    ;(window as any).SessionRecorder = this
  }

  public stop = (): void => {
    if (!this.recording) {
      _warn('record not started')
      return
    }

    this.recording = false

    // clear trail
    this.trail.length = 0
  }

  public uninstallObservers = (): void => {
    // walk and uninstall observers
    Object.keys(this.observers).forEach(observerName => {
      ;(this.observers[observerName] as HighOrderObserver).uninstall()
    })
  }
}
