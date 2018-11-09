import { ObserverClass } from '../models/observers'
import { _original, _log, _parseURL, _replace } from '../tools/helpers'
import { HistoryRecord, HistoryTypes } from '../models/observers/history'

export default class HistoryObserver implements ObserverClass {
  public name: string = 'HistoryObserver'
  public status: boolean = false
  private lastHref: string

  constructor(public onobserved) {
    this.install()
  }

  getHistoryRecord(from: string | undefined, to: string | undefined): void {
    const parsedHref = _parseURL(location.href)
    const parsedTo = _parseURL(to)
    let parsedFrom = _parseURL(from)

    // Initial pushState doesn't provide `from` information
    if (!parsedFrom.path) {
      parsedFrom = parsedHref
    }

    this.lastHref = to

    const record: HistoryRecord = {
      type: HistoryTypes.history,
      from: parsedFrom.relative,
      to: parsedTo.relative
    }

    const { onobserved } = this
    onobserved && onobserved(record)
  }

  isSupportHistory(): boolean {
    return (
      'history' in window &&
      !!window.history.pushState &&
      !!window.history.replaceState
    )
  }

  install(): void {
    if (!this.isSupportHistory()) return

    const { getHistoryRecord } = this
    const self = this

    _replace(window, 'onpopstate', function(originalHandler) {
      return function(this: History, ...args: any[]): void {
        getHistoryRecord.call(self.lastHref, location.href)

        originalHandler && originalHandler.apply(this, args)
      }
    })

    function historyReplacement(originalMethod) {
      return function(this: History, ...args: any[]): void {
        const url = args.length > 2 ? args[2] : undefined

        if (url) getHistoryRecord(self.lastHref, String(url))

        return originalMethod.apply(this, args)
      }
    }

    _replace(window.history, 'pushState', historyReplacement)
    _replace(window.history, 'replaceState', historyReplacement)

    _log('history installed')
    this.status = true
  }

  uninstall(): void {
    _original(window, 'onpopstate')
    _original(window.history, 'pushState')
    _original(window.history, 'replaceState')
    this.status = false
  }
}
