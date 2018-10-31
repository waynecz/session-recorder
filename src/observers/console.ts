import { ObserverClass } from 'models/observers'
import {
  ConsoleObserveOptions,
  ConsoleTypes,
  ConsoleRecord,
  ConsoleLevels
} from 'models/observers/console'

export default class ConsoleObserver implements ObserverClass {
  public name: string = 'ConsoleObserver'
  private consoleLevels: string[] = Object.keys(ConsoleLevels)
  private originals: Map<string, Function> = new Map()
  public options

  constructor(public onobserved, options?: ConsoleObserveOptions | boolean) {
    if (options === false) return
    this.options = options
    this.install(options as ConsoleObserveOptions)
  }

  install(options: ConsoleObserveOptions): void {
    options = {
      info: true,
      error: true,
      log: true,
      warn: true,
      debug: false,
      ...options
    }
    this.consoleLevels.forEach(
      (level: string): void => {
        if (!options[level]) return

        const originalConsoleFunc: Function = console[level]
        this.originals.set(level, originalConsoleFunc)

        console[level] = function<T>(...args: T[]): T {
          if (!args.length) return

          const record: ConsoleRecord = {
            type: ConsoleTypes.console,
            l: level as ConsoleLevels,
            msg: args
          }
          this.onobserved(record)
          return
        }
      }
    )
  }

  uninstall(): void {
    this.originals.forEach((originalConsoleFunc, level) => {
      console[level] = originalConsoleFunc
    })
  }
}
