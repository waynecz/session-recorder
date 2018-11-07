import { Record, ObserverClass } from 'models/observers'
import ConsoleObserver from 'observers/console'
import EventObserver from 'observers/event'
import HttpObserver from 'observers/http'
import DOMMutationObserver from 'observers/mutation'
import JSErrorObserver from 'observers/js-error'
import { _log, _warn } from 'tools/helpers'
import HistoryObserver from 'observers/history'
import MouseObserver from 'observers/mouse'

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

  public recording: boolean = false

  constructor() {}

  recordUI(record) {
    if (!this.recording) return
    record = { t: Date.now() - this.time, ...record }
    this.trace.ui.push(record)
  }

  recordMouse(record) {
    if (!this.recording) return
    record = { t: Date.now() - this.time, ...record }
    this.trace.mouse.push(record)
  }

  public start() {
    if (this.recording) {
      _warn('record already started')
      return
    }
    console.time('[Friday recorder]')
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
    console.timeEnd('[Friday recorder]')
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
