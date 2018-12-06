import { ObserverExtensionClass, ObserverClass } from './models/observers'
import { RecorderOptions } from './models'

import ConsoleObserver from './observers/console'
import EventObserver from './observers/event'
import HttpObserver from './observers/http'
import DOMMutationObserver from './observers/mutation'
import JSErrorObserver from './observers/js-error'
import HistoryObserver from './observers/history'
import MouseObserver from './observers/mouse'
import RecorderDocument from './tools/document'
import { _log, _warn, _now } from './tools/helpers'
import { RECORDER_OPTIONS } from './constants';

export default class Recorder {
  public trail: any[] = []
  public observers: { [key: string]: any } = {
    mutation: null,
    console: null,
    event: null,
    mouse: null,
    error: null,
    history: null
  }

  public MAX_TIME: number = 60000 // max record length(ms)
  public baseTime: number = 0
  public options: RecorderOptions = RECORDER_OPTIONS

  public recording: boolean = false

  constructor(options?: RecorderOptions) {
    if (options) {
      Object.assign(this.options, options)
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

    Object.assign(this.observers, {
      mutation: new DOMMutationObserver(mutation),
      console: new ConsoleObserver(consoleOpt),
      event: new EventObserver(event),
      mouse: new MouseObserver(mouse),
      http: new HttpObserver(http),
      error: new JSErrorObserver(error),
      history: new HistoryObserver(history)
    })

    Object.entries(this.observers).forEach(
      ([_, observer]: [string, ObserverClass]) => {
        observer.$on('observed', this.push2Trail.bind(this))
      }
    )

    RecorderDocument.init()
  }

  private push2Trail = record => {
    if (!this.recording) return
    record = { t: _now() - this.baseTime, ...record }
    // limit the time of trail
    if (this.trail.length && record.t - this.trail[0].t > this.MAX_TIME) {
      this.trail.shift()
    }
    this.trail.push(record)
  }

  public start = () => {
    if (this.recording) {
      _warn('record already started')
      return
    }

    this.recording = true

    Object.entries(this.observers).forEach(
      ([_, observer]: [string, ObserverExtensionClass]) => {
        observer.install()
      }
    )

    this.baseTime = _now()
    ;(window as any).__SESSION_RECORDER__ = this
  }

  public end() {
    if (!this.recording) {
      _warn('record not started')
      return
    }
    // walk and uninstall observers
    Object.entries(this.observers).forEach(
      ([_, observer]: [string, ObserverExtensionClass]) => {
        observer.uninstall()
      }
    )

    this.recording = false
  }

  public saveTrail2LocalStorage(): void {
    window.localStorage.setItem('trail', JSON.stringify(this.trail))
  }
}

;(window as any).Recorder = Recorder
