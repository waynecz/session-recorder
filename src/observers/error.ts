import { _replace, _log, _recover } from '../tools/helpers'
import { RECORDER_PRESET } from '../constants'
import EventDrivenable from '../tools/pub-sub'
import { Observer, ErrorOptions, ErrorRecord, ErrorTypes } from '../models/observers'

export default class ErrorObserver extends EventDrivenable implements Observer {
  public options: ErrorOptions = RECORDER_PRESET.error

  constructor(options?: any) {
    super()

    if (typeof options === 'boolean' && options === false) {
      return
    }

    if (typeof options === 'object') {
      this.options = { ...this.options, ...options }
    }
  }

  // TODO: generate stack of an error which is acceptable for sentry
  public getStackTeace() {
    /* TODO */
  }

  private installGlobalerrorHandler(): void {
    const { getGlobalerrorReocrd } = this

    _replace(window, 'onerror', oldOnerrorHandler => {
      const recorderOnerrorHandler = function(
        message: string | ErrorEvent,
        filename: any,
        lineno: any,
        colno: any,
        error: Error | ErrorEvent
      ) {
        /**
         * "For historical reasons, different arguments are passed to window.onerror and element.onerror handlers"
         *  more: - https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror
         *       - https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#Syntax
         */
        if (error && error instanceof ErrorEvent) {
          getGlobalerrorReocrd(error)
        } else if (message instanceof ErrorEvent) {
          getGlobalerrorReocrd(message)
        } else {
          getGlobalerrorReocrd({
            message,
            filename,
            lineno,
            colno,
            error
          } as ErrorEvent)
        }

        if (oldOnerrorHandler) {
          // TODO: find approximate "this" scope for oldOnerrorHandler - not window
          oldOnerrorHandler.apply(window, arguments)
        }
      }

      return recorderOnerrorHandler
    })
  }

  private installUnhanldledrejectionHandler(): void {
    const { getUnhandlerejectionRecord } = this

    _replace(window, 'onunhandledrejection', originalUnhanldledrejectionHandler => {
      // more: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
      return function(this: PromiseRejectionEvent, errevt: PromiseRejectionEvent) {
        getUnhandlerejectionRecord(errevt)
        if (originalUnhanldledrejectionHandler) {
          originalUnhanldledrejectionHandler.call(this, errevt)
        }
      }
    })
  }

  private getGlobalerrorReocrd = (errevt: ErrorEvent): void => {
    const { message: msg, lineno, colno, error: err, filename: url } = errevt
    const record: ErrorRecord = {
      type: ErrorTypes.jserr,
      url,
      line: `${lineno}:${colno}`,
      msg,
      err,
      stack: err.stack
    }

    const { $emit } = this

    $emit('observed', record, errevt)
  }

  private getUnhandlerejectionRecord = (errevt: PromiseRejectionEvent): void => {
    const reason = errevt.reason || ''

    const record: ErrorRecord = {
      type: ErrorTypes.unhandledrejection,
      msg: reason,
      stack: reason.stack
    }

    const { $emit } = this

    $emit('observed', record, errevt)
  }

  public install(): void {
    const { jserror, unhandledrejection } = this.options
    if (jserror) {
      this.installGlobalerrorHandler()

      // TODO: protect recorder's onerror hook by defineProperty
      Object.defineProperty(window, 'onerror', {
        set(newHook) {
          if (!newHook.__recorder__) {
            _log('recorder error handler died!')
          }
        }
      })
    }

    if (unhandledrejection) {
      this.installUnhanldledrejectionHandler()
    }

    _log('error observer ready!')
  }

  public uninstall(): void {
    const { jserror, unhandledrejection } = this.options

    if (jserror) {
      _recover(window, 'onerror')
    }

    if (unhandledrejection) {
      _recover(window, 'onunhandledrejection')
    }
  }
}
