import { Record, ObserverClass } from './models/observers'
import { _log, _warn } from './tools/helpers'

import ConsoleObserver from './observers/console'
import EventObserver from './observers/event'
import HttpObserver from './observers/http'
import DOMMutationObserver from './observers/mutation'
import JSErrorObserver from './observers/js-error'
import HistoryObserver from './observers/history'
import MouseObserver from './observers/mouse'
import RecorderDocument from './tools/document'

export default class Recorder implements Recorder {
  public trace: {
    [key: string]: Record[]
  } = {
    ui: [],
    mouse: []
  }
  public observers: { [key: string]: any } = {
    mutation: null,
    console: null,
    event: null,
    mouse: null,
    error: null,
    history: null
  }

  public MAX_MINS: number = 30 // max record time length(second)
  public time: number = 0
  public document: any

  public recording: boolean = false

  constructor() {}

  private recordUI(record) {
    if (!this.recording) return
    record = { t: Date.now() - this.time, ...record }
    this.trace.ui.push(record)
  }

  private recordMouse(record) {
    if (!this.recording) return
    record = { t: Date.now() - this.time, ...record }
    this.trace.mouse.push(record)
  }

  public start() {
    if (this.recording) {
      _warn('record already started')
      return
    }

    this.document = RecorderDocument.init()

    console.time('[Recorder setup]')
    let { recordUI, recordMouse } = this
    recordUI = recordUI.bind(this)
    recordMouse = recordMouse.bind(this)

    this.time = Date.now()

    this.observers.mutation = new DOMMutationObserver({ onobserved: recordUI })
    this.observers.console = new ConsoleObserver({
      onobserved: recordUI,
      options: { log: false }
    })
    this.observers.event = new EventObserver({ onobserved: recordUI })
    this.observers.mouse = new MouseObserver({ onobserved: recordMouse })
    this.observers.http = new HttpObserver({ onobserved: recordUI })
    this.observers.error = new JSErrorObserver({ onobserved: recordUI })
    this.observers.history = new HistoryObserver({ onobserved: recordUI })

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
}
