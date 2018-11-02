import { ObserverClass } from 'models/observers'
import {
  ErrorObserveOptions,
  ErrorRecord,
  ErrorTypes
} from 'models/observers/error'
import { _replace, _log } from 'tools/helpers'

// TODO: error stack trace compution
export default class JSErrorObserver implements ObserverClass {
  public name: string = 'JSErrorObserver'
  public options: ErrorObserveOptions = {
    jserror: true,
    unhandledrejection: true
  }
  public active: boolean

  constructor(public onobserved, options?: ErrorObserveOptions | boolean) {
    if (options === false) return

    Object.assign(this.options, options)

    this.install()
  }

  public getStackTeace() {}

  private installGlobalerrorHandler(): void {
    const { getGlobalerrorReocrd } = this
    _replace(window, 'onerror', oldOnerrorHandler => {
      /**
       * "For historical reasons, different arguments are passed to window.onerror and element.onerror handlers"
       * more: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#Syntax
       **/
      const fridayOnerrorHandler = function(
        message: string | ErrorEvent,
        filename: any,
        lineno: any,
        colno: any,
        error: Error | ErrorEvent
      ) {
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

        // TODO: find approximate "this" scope for oldOnerrorHandler - not window
        if (oldOnerrorHandler) {
          oldOnerrorHandler.apply(window, arguments)
        }
      }

      return fridayOnerrorHandler
    })
  }

  private installUnhanldledrejectionHandler(): void {
    const { getUnhandlerejectionRecord } = this
    _replace(
      window,
      'onunhandledrejection',
      originalUnhanldledrejectionHandler => {
        // more: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
        return function(
          this: PromiseRejectionEvent,
          errevt: PromiseRejectionEvent
        ) {
          getUnhandlerejectionRecord(errevt)
          if (originalUnhanldledrejectionHandler) {
            originalUnhanldledrejectionHandler.call(this, errevt)
          }
        }
      }
    )
  }

  private getGlobalerrorReocrd = (errevt: ErrorEvent): void => {
    const { message: msg, lineno, colno, error: err, filename: url } = errevt
    const record: ErrorRecord = {
      type: ErrorTypes.jserr,
      url,
      line: `${lineno}:${colno}`,
      msg,
      err
    }

    this.onobserved(record)
  }

  private getUnhandlerejectionRecord = (errevt: PromiseRejectionEvent): void => {
    let _errevt = { ...errevt }

    if (!_errevt) {
      _errevt.reason = 'undefined'
    }

    const { reason: msg } = _errevt
    const record: ErrorRecord = {
      type: ErrorTypes.unhandledrejection,
      msg
    }

    this.onobserved(record)
  }

  install(): void {
    const { jserror, unhandledrejection } = this.options
    if (jserror) {
      this.installGlobalerrorHandler()

      // TODO: protect friday's onerror's hook by defineProperty
      Object.defineProperty(window, 'onerror', {
        set(newHook) {
          if (!newHook.__friday__) {
            _log('friday error handler died!')
          }
        }
      })
    }

    if (unhandledrejection) {
      this.installUnhanldledrejectionHandler()
    }

    _log('error installed!')

    this.active = true
  }

  uninstall(): void {
    window.removeEventListener('error', this.getGlobalerrorReocrd)
    window.removeEventListener(
      'unhandledrejection',
      this.getUnhandlerejectionRecord
    )

    this.active = false
  }
}
