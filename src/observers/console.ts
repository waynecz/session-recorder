import { ObserverClass, ObserverConstructorParams } from '../models/observers'
import {
  ConsoleObserveOptions,
  ConsoleTypes,
  ConsoleRecord,
  ConsoleLevels
} from '../models/observers/console'
import { _replace, _original, _log } from '../tools/helpers'

export default class ConsoleObserver implements ObserverClass {
  public name: string = 'ConsoleObserver'
  private consoleLevels: string[] = Object.keys(ConsoleLevels)
  public onobserved
  public options: ConsoleObserveOptions = {
    info: true,
    error: true,
    log: true,
    warn: true,
    debug: false
  }
  public status: ConsoleObserveOptions = {
    info: false,
    error: false,
    log: false,
    warn: false,
    debug: false
  }

  constructor({ onobserved, options }: ObserverConstructorParams) {
    if (options === false) return

    Object.assign(this.options, options)
    this.onobserved = onobserved

    this.install()
  }

  install(): void {
    const { onobserved, status } = this

    this.consoleLevels.forEach(
      (level: string): void => {
        if (!this.options[level]) return

        function consoleReplacement(originalConsoleFunc) {
          return function(...args) {
            if (!args.length) return

            const record: ConsoleRecord = {
              type: ConsoleTypes.console,
              l: level as ConsoleLevels,
              msg: args
            }

            onobserved && onobserved(record)

            if (originalConsoleFunc) {
              originalConsoleFunc.call(console, ...args)
            }
          }
        }

        _replace(console, level, consoleReplacement)

        status[level] = true
      }
    )
    _log('console installed!')
  }

  uninstall(): void {
    this.consoleLevels.forEach(
      (level: string): void => {
        if (!this.options[level]) return

        _original(console, level)

        status[level] = false
      }
    )
  }
}
