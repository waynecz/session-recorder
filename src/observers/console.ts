import { Observer, ConsoleLevels, ConsoleRecord } from '../models/observers'
import { _replace, _recover, _log } from '../tools/helpers'
import { RECORDER_PRESET } from '../constants'
import EventDrivenable from '../tools/pub-sub'

export default class ConsoleObserver extends EventDrivenable implements Observer {
  private consoleLevels = Object.keys(RECORDER_PRESET.console)

  public options = RECORDER_PRESET.console

  constructor(options?: any) {
    super()
    if (typeof options === 'boolean' && options === false) {
      return
    }

    if (typeof options === 'object') {
      this.options = { ...this.options, ...options }
    }
  }

  public install(): void {
    const { $emit } = this

    this.consoleLevels.forEach(
      (level): void => {
        if (!this.options[level]) return

        function consoleReplacement(originalConsoleFunc: Function) {
          return function(...args: any[]) {
            if (!args.length) return

            const record: ConsoleRecord = {
              type: 'console',
              level: level as ConsoleLevels,
              input: args
            }

            $emit('observed', record)

            if (originalConsoleFunc) {
              originalConsoleFunc.call(console, ...args)
            }
          }
        }

        _replace(console, level, consoleReplacement)
      }
    )
    _log('console observer ready!')
  }

  public uninstall(): void {
    this.consoleLevels.forEach(
      (level): void => {
        if (!this.options[level]) return

        _recover(console, level)
      }
    )
  }
}
