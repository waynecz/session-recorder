import { HighOrderObserver } from './models/observers'
import {
  RecorderOptions,
  Recorder,
  DomTreeBufferer,
  Observers,
  ObserverName
} from './models'

import ConsoleObserverClass from './observers/console'
import EventObserverClass from './observers/event'
import HttpObserverClass from './observers/http'
import DOMMutationObserverClass from './observers/mutation'
import JSErrorObserverClass from './observers/js-error'
import HistoryObserverClass from './observers/history'
import MouseObserverClass from './observers/mouse'
import domTreeBufferer from './tools/dom-bufferer'
import { _log, _warn, _now } from './tools/helpers'
import { RECORDER_OPTIONS } from './constants'

export default class RecorderClass implements Recorder {
  public trail: any[] = []
  public observers: Observers = {
    mutation: null,
    console: null,
    event: null,
    mouse: null,
    error: null,
    history: null
  }
  public domTreeBufferer: DomTreeBufferer
  public MAX_TIME: number = 60000 // max record length(ms)
  public options: RecorderOptions = RECORDER_OPTIONS
  public baseTime: number = 0

  public recording: boolean = false

  constructor(options?: RecorderOptions) {
    if (options) {
      Object.assign(this.options, options)
    }

    this.domTreeBufferer = domTreeBufferer

    const {
      mutation,
      history,
      http,
      event,
      error,
      console: consoleOpt,
      mouse
    } = this.options

    Object.assign(this.observers, {
      console: new ConsoleObserverClass(consoleOpt),
      mutation: new DOMMutationObserverClass(mutation),
      event: new EventObserverClass(event),
      mouse: new MouseObserverClass(mouse),
      http: new HttpObserverClass(http),
      error: new JSErrorObserverClass(error),
      history: new HistoryObserverClass(history)
    })

    Object.keys(this.observers).forEach((observerName: ObserverName) => {
      const observer = this.observers[observerName]

      observer.$on('observed', this.pushToTrail.bind(this))
    })
  }

  public pushToTrail = (record): void => {
    if (!this.recording) return
    record = { t: _now() - this.baseTime, ...record }
    // limit the time of trail
    if (this.trail.length && record.t - this.trail[0].t > this.MAX_TIME) {
      this.trail.shift()
    }
    this.trail.push(record)
  }

  public clearTrail = (): void => {
    this.trail = []
  }

  public start = (): void => {
    if (this.recording) {
      _warn('record already started')
      return
    }
    
    this.recording = true

    this.domTreeBufferer.takeSnapshotForPageDocument()

    Object.keys(this.observers).forEach(observerName => {
      ;(this.observers[observerName] as HighOrderObserver).install()
    })

    this.baseTime = _now()

    ;(window as any).__SESSION_RECORDER__ = this
  }

  public stop = (): void => {
    if (!this.recording) {
      _warn('record not started')
      return
    }

    this.recording = false
  }

  public uninstallObservers = (): void => {
    // walk and uninstall observers
    Object.keys(this.observers).forEach(observerName => {
      ;(this.observers[observerName] as HighOrderObserver).uninstall()
    })
  }
}

;(window as any).Recorder = RecorderClass
