import { Record } from 'models/observers'
import ConsoleObserver from 'observers/console'
import EventObserver from 'observers/event'
import HttpObserver from 'observers/http'
import DOMMutationObserver from 'observers/mutation'
import JSErrorObserver from 'observers/js-error'
import { _log } from 'tools/helpers'
import HistoryObserver from 'observers/history'
import MouseObserver from 'observers/mouse'

export default class Recorder {
  public trace: {
    [key: string]: Record[]
  } = {
    ui: [],
    mouse: []
  }
  public MAX_MINS: number = 30 // max record time length(second)

  constructor() {
    this.install()
  }

  UIRecord(record) {
    record = { t: parseInt(performance.now() + ''), ...record }
    this.trace.ui.push(record)
  }

  MouseRecord(record) {
    record = { t: parseInt(performance.now() + ''), ...record }
    this.trace.mouse.push(record)
  }

  public install() {
    console.time('[Friday recorder installation]')
    let { UIRecord, MouseRecord } = this
    UIRecord = UIRecord.bind(this)
    MouseRecord = MouseRecord.bind(this)

    new DOMMutationObserver({ onobserved: UIRecord })
    new ConsoleObserver({ onobserved: UIRecord, options: { log: false } })
    new EventObserver({ onobserved: UIRecord })
    new MouseObserver({ onobserved: MouseRecord })
    new HttpObserver({ onobserved: UIRecord })
    new JSErrorObserver({ onobserved: UIRecord })
    new HistoryObserver({ onobserved: UIRecord })
    console.timeEnd('[Friday recorder installation]')
  }
}
