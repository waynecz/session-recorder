import { Record } from 'models/observers'
import ConsoleObserver from 'observers/console'
import EventObserver from 'observers/event'
import HttpObserver from 'observers/http'
import DOMMutationObserver from 'observers/mutation'
import JSErrorObserver from 'observers/js-error'
import { _log } from 'tools/helpers'
import HistoryObserver from 'observers/history'

export default class Recorder {
  public trace: Record[] = []
  public MAX_MINS: number = 30 // max record time length(second)

  constructor() {
    console.time('[Friday recorder installation] :')
    this.install()
    console.timeEnd('[Friday recorder installation] :')
  }

  addToTrace(record) {
    record = { t: parseInt(performance.now() + ''), ...record }
    this.trace.push(record)
  }

  install() {
    let { addToTrace } = this
    addToTrace = addToTrace.bind(this)

    new DOMMutationObserver(addToTrace)
    new ConsoleObserver(addToTrace, { log: false })
    new EventObserver(addToTrace)
    new HttpObserver(addToTrace)
    new JSErrorObserver(addToTrace)
    new HistoryObserver(addToTrace)
  }
}
