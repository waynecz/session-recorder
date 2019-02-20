import { _recover, _log, _parseURL, _replace } from '../tools/helpers'
import EventDrivenable from '../tools/pub-sub'
import { Observer, HistoryRecord, HistoryTypes } from '../models/observers'

export default class HistoryObserver extends EventDrivenable implements Observer {
  public status: boolean = false
  private lastHref: string

  constructor(options: boolean) {
    super()

    if (options === false) return
  }

  private getHistoryRecord(from: string | undefined, to: string | undefined): void {
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

    const { $emit } = this

    $emit('observed', record)
  }

  private isSupportHistory(): boolean {
    return 'history' in window && !!window.history.pushState && !!window.history.replaceState
  }

  public install(): void {
    if (!this.isSupportHistory()) return

    const { getHistoryRecord } = this
    const self = this

    _replace(window, 'onpopstate', function(originalHandler) {
      return function(this: History, ...args: any[]): void {
        getHistoryRecord.call(self, self.lastHref, location.href)

        originalHandler && originalHandler.apply(this, args)
      }
    })

    function historyReplacement(originalMethod) {
      return function(this: History, ...args: any[]): void {
        const url = args.length > 2 ? args[2] : undefined

        if (url) getHistoryRecord.call(self, self.lastHref, String(url))

        return originalMethod.apply(this, args)
      }
    }

    _replace(window.history, 'pushState', historyReplacement)
    _replace(window.history, 'replaceState', historyReplacement)

    _log('history installed')
    this.status = true
  }

  public uninstall(): void {
    _recover(window, 'onpopstate')
    _recover(window.history, 'pushState')
    _recover(window.history, 'replaceState')
    this.status = false
  }
}
