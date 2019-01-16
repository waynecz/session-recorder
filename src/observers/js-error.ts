import { HighOrderObserver } from '../models/observers'
import {
  ErrorObserveOptions,
  ErrorRecord,
  ErrorTypes
} from '../models/observers/error'
import { _replace, _log, _recover } from '../tools/helpers'
import BasicObserverClass from './index';
import { RECORDER_OPTIONS } from '../constants';

// TODO: error stack trace compution
export default class JSErrorObserverClass extends BasicObserverClass implements HighOrderObserver {
  public name: string = 'JSErrorObserverClass'
  public options: ErrorObserveOptions = RECORDER_OPTIONS.error

  public status: ErrorObserveOptions = {
    jserror: false,
    unhandledrejection: false
  }
  public active: boolean

  constructor(options: ErrorObserveOptions | boolean) {
    super()

    if (options === false) return

    if (typeof options === 'object') {
      this.options = { ...this.options, ...options }
    }
  }

  // TODO: generate stack of an error which is acceptable for sentry
  public getStackTeace() {}

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
         **/
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

    const { $emit } = this

    $emit('observed', record, errevt)
  }

  private getUnhandlerejectionRecord = (
    errevt: PromiseRejectionEvent
  ): void => {
    let _errevt = { ...errevt }

    if (!_errevt) {
      _errevt.reason = 'undefined'
    }

    const record: ErrorRecord = {
      type: ErrorTypes.unhandledrejection,
      msg: _errevt.reason
    }

    const { $emit } = this

    $emit('observed', record, errevt)
  }

  public install(): void {
    const { jserror, unhandledrejection } = this.options
    if (jserror) {
      this.installGlobalerrorHandler()
      this.status.jserror = true

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
      this.status.unhandledrejection = true
    }

    _log('error observer ready!')
  }

  public uninstall(): void {
    const { jserror, unhandledrejection } = this.options

    if (jserror) {
      _recover(window, 'onerror')
      this.status.jserror = false
    }

    if (unhandledrejection) {
      _recover(window, 'onunhandledrejection')
      this.status.unhandledrejection = false
    }
  }
}
