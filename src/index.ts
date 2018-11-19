import { ObserverClass } from './models/observers'
import { _log, _warn, _now } from './tools/helpers'

import ConsoleObserver from './observers/console'
import EventObserver from './observers/event'
import HttpObserver from './observers/http'
import DOMMutationObserver from './observers/mutation'
import JSErrorObserver from './observers/js-error'
import HistoryObserver from './observers/history'
import MouseObserver from './observers/mouse'
import RecorderDocument from './tools/document'

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

  public MAX_MINS: number = 30 // max record time length(second)
  public baseTime: number = 0
  public document: any

  public recording: boolean = false

  constructor() {
    this.document = RecorderDocument.init()
  }

  private push2Trail = (record) => {
    if (!this.recording) return
    record = { t: _now() - this.baseTime, ...record }
    this.trail.push(record)
  }

  public start = () => {
    if (this.recording) {
      _warn('record already started')
      return
    }

    console.time('[Recorder setup]')
    let { push2Trail } = this
    push2Trail = push2Trail.bind(this)

    this.baseTime = _now()

    Object.assign(this.observers, {
      mutation: new DOMMutationObserver({
        onobserved: push2Trail
      }),
      console: new ConsoleObserver({ onobserved: push2Trail }),
      event: new EventObserver({ onobserved: push2Trail }),
      mouse: new MouseObserver({ onobserved: push2Trail }),
      http: new HttpObserver({ onobserved: push2Trail }),
      error: new JSErrorObserver({ onobserved: push2Trail }),
      history: new HistoryObserver({ onobserved: push2Trail })
    })

    this.recording = true
    console.timeEnd('[Recorder setup]')
    ;(window as any).__RECORDER__ = this
  }

  public end() {
    if (!this.recording) {
      _warn('record not started')
      return
    }
    // walk and uninstall observers
    Object.entries(this.observers).forEach(
      ([_, observer]: [string, ObserverClass]) => {
        observer.uninstall()
      }
    )
    this.recording = false
  }

  public saveTrail(): void {
    window.localStorage.setItem('trail', JSON.stringify(this.trail))
  }
}

(window as any).Recorder = Recorder