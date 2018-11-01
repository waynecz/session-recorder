import { ObserverClass } from 'models/observers'
import {
  ConsoleObserveOptions,
  ConsoleTypes,
  ConsoleRecord,
  ConsoleLevels
} from 'models/observers/console'
import { _replace, _original } from 'tools/helpers'

export default class ConsoleObserver implements ObserverClass {
  public name: string = 'ConsoleObserver'
  private consoleLevels: string[] = Object.keys(ConsoleLevels)
  public active: boolean
  public options: ConsoleObserveOptions = {
    info: true,
    error: true,
    log: true,
    warn: true,
    debug: false
  }

  constructor(public onobserved, options: ConsoleObserveOptions | boolean) {
    if (options === false) return

    Object.assign(this.options, options)

    this.install()
  }

  install(): void {
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

            this.onobserved(record)

            if (originalConsoleFunc) {
              originalConsoleFunc.call(console, ...args)
            }
          }
        }

        _replace(console, level, consoleReplacement)
      }
    )
    this.active = true
  }

  uninstall(): void {
    this.consoleLevels.forEach(
      (level: string): void => {
        if (!this.options[level]) return

        _original(console, level)
      }
    )

    this.active = false
  }
}
