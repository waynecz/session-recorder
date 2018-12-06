import { HighOrderObserver, BasicObserver } from './models/observers'
import { RecorderOptions, Recorder } from './models'

import ConsoleObserverClass from './observers/console'
import EventObserverClass from './observers/event'
import HttpObserverClass from './observers/http'
import DOMMutationObserverClass from './observers/mutation'
import JSErrorObserverClass from './observers/js-error'
import HistoryObserverClass from './observers/history'
import MouseObserverClass from './observers/mouse'
import documentBufferer from './tools/document'
import { _log, _warn, _now } from './tools/helpers'
import { RECORDER_OPTIONS } from './constants';

export default class RecorderClass implements Recorder {
  public trail: any[] = []
  public observers: { [key: string]: any } = {
    mutation: null,
    console: null,
    event: null,
    mouse: null,
    error: null,
    history: null
  }
  public docBufferer: any
  public MAX_TIME: number = 60000 // max record length(ms)
  public baseTime
  public options: RecorderOptions = RECORDER_OPTIONS

  public recording: boolean = false

  constructor(options?: RecorderOptions) {
    if (options) {
      Object.assign(this.options, options)
    }

    this.docBufferer = documentBufferer;

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
      mutation: new DOMMutationObserverClass(mutation),
      console: new ConsoleObserverClass(consoleOpt),
      event: new EventObserverClass(event),
      mouse: new MouseObserverClass(mouse),
      http: new HttpObserverClass(http),
      error: new JSErrorObserverClass(error),
      history: new HistoryObserverClass(history)
    })


    Object.entries(this.observers).forEach(
      ([_, observer]: [string, BasicObserver]) => {
        observer.$on('observed', this.pushToTrail.bind(this))
      }
    )

    this.docBufferer.init()
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

  public start = (): void => {
    if (this.recording) {
      _warn('record already started')
      return
    }

    this.recording = true

    Object.entries(this.observers).forEach(
      ([_, observer]: [string, HighOrderObserver]) => {
        observer.install()
      }
    )

    this.baseTime = _now()
    ;(window as any).__SESSION_RECORDER__ = this
  }

  public stop(): void {
    if (!this.recording) {
      _warn('record not started')
      return
    }
    // walk and uninstall observers
    Object.entries(this.observers).forEach(
      ([_, observer]: [string, HighOrderObserver]) => {
        observer.uninstall()
      }
    )

    this.recording = false
  }
}

;(window as any).Recorder = RecorderClass
