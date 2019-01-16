import { HighOrderObserver } from '../models/observers'
import { MouseReocrd, MouseTypes } from '../models/observers/event'
import { MouseObserverOptions, Listener } from '../models/observers/event'
import { _throttle, _log } from '../tools/helpers'
import BasicObserverClass from './index'
import { RECORDER_OPTIONS } from '../constants'

/**
 * Observe mouse behavior
 * and produce an Record
 **/
export default class MouseObserverClass extends BasicObserverClass
  implements HighOrderObserver {
  public name: string = 'MouseObserverClass'
  public listeners: Listener[] = []
  public options: MouseObserverOptions = RECORDER_OPTIONS.mouse

  public status: MouseObserverOptions = {
    click: false,
    mousemove: false
  }

  constructor(options: MouseObserverOptions | boolean) {
    super()
    if (options === false) return

    if (typeof options === 'object') {
      this.options = { ...this.options, ...options }
    }
  }

  private addListener = (
    { target, event, callback, options = false }: Listener,
    cb?: () => void
  ) => {
    target.addEventListener(event, callback, options)

    this.listeners.push({
      target,
      event,
      callback
    })

    cb && cb()
  }

  private getMouseClickRecord = (evt: MouseEvent): void => {
    const { pageX: x, pageY: y } = evt
    const record: MouseReocrd = { type: MouseTypes.click, x, y }
    const { $emit } = this

    $emit('observed', record)
  }

  private getMouseMoveRecord = (evt: MouseEvent): void => {
    const { pageX: x, pageY: y } = evt
    const record: MouseReocrd = { type: MouseTypes.move, x, y }
    const { $emit } = this

    $emit('observed', record)
  }

  public install(): void {
    const { addListener } = this

    const { click, mousemove } = this.options

    if (click) {
      addListener({
        target: document,
        event: 'click',
        callback: this.getMouseClickRecord
      })
      this.status.click = true
    }

    if (mousemove) {
      addListener({
        target: document,
        event: 'mousemove',
        callback: _throttle(this.getMouseMoveRecord, 500)
      })

      this.status.mousemove = true
    }

    _log('mouse observer ready!')
  }

  public uninstall() {
    this.listeners.forEach(({ target, event, callback }) => {
      target.removeEventListener(event, callback)

      this.status[event] = false
    })
  }
}
