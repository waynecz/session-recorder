import { ObserverClass } from 'models/observers'
import {
  ErrorObserveOptions,
  ErrorRecord,
  ErrorTypes
} from 'models/observers/error'

export default class JSErrorObserver implements ObserverClass {
  public name: string = 'JSErrorObserver'
  public options

  constructor(public onobserved, options?: ErrorObserveOptions | boolean) {
    if (options === false) return

    this.options = options
    this.install(options as ErrorObserveOptions)
  }

  private getGlobalerrorReocrd(errevt: ErrorEvent) {
    const { message: msg, lineno, colno, error: err, filename: file } = errevt
    const record: ErrorRecord = {
      type: ErrorTypes.jserr,
      file,
      line: `${lineno}:${colno}`,
      msg,
      err
    }

    this.onobserved(record)
  }

  private getUnhandlerejectionRecord(errevt: PromiseRejectionEvent) {
    const { reason: msg } = errevt
    const record: ErrorRecord = {
      type: ErrorTypes.reject,
      msg
    }

    this.onobserved(record)
  }

  install({
    jserror = true,
    unhandlerejection = true
  }: ErrorObserveOptions): void {
    if (jserror) {
      window.addEventListener('error', this.getGlobalerrorReocrd)
    }

    if (unhandlerejection) {
      window.addEventListener(
        'unhandledrejection',
        this.getUnhandlerejectionRecord
      )
    }
  }

  uninstall(): void {
    window.removeEventListener('error', this.getGlobalerrorReocrd)
    window.removeEventListener(
      'unhandledrejection',
      this.getUnhandlerejectionRecord
    )
  }
}
