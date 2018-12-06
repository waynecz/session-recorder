import { ObserverExtensionClass } from '../models/observers'
import {
  ConsoleObserveOptions,
  ConsoleTypes,
  ConsoleRecord,
  ConsoleLevels
} from '../models/observers/console'
import { _replace, _original, _log } from '../tools/helpers'
import Observer from './';
import { RECORDER_OPTIONS } from '../constants';

export default class ConsoleObserver extends Observer implements ObserverExtensionClass {
  public name: string = 'ConsoleObserver'
  private consoleLevels: string[] = Object.keys(ConsoleLevels)
  public options: ConsoleObserveOptions = {
    info: true,
    error: true,
    log: false,
    warn: true,
    debug: false
  }
  public status = RECORDER_OPTIONS.console

  constructor(options: ConsoleObserveOptions | boolean) {
    super()
    if (options === false) return

    Object.assign(this.options, options)
  }

  public install(): void {
    const { status, $emit } = this

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

            $emit('observed', record)

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

  public uninstall(): void {
    this.consoleLevels.forEach(
      (level: string): void => {
        if (!this.options[level]) return

        _original(console, level)

        status[level] = false
      }
    )
  }
}
