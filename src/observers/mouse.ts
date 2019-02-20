import { MouseReocrd, MouseTypes, Observer, Listener } from '../models/observers'
import { _throttle, _log } from '../tools/helpers'
import { RECORDER_PRESET } from '../constants'
import EventDrivenable from '../tools/pub-sub'

/**
 * Observe mouse behavior
 * and produce an Record
 */
export default class MouseObserver extends EventDrivenable implements Observer {
  public listeners: Listener[] = []
  public options = RECORDER_PRESET.mouse

  constructor(options?: any) {
    super()
    if (typeof options === 'boolean' && options === false) {
      return
    }

    if (typeof options === 'object') {
      this.options = { ...this.options, ...options }
    }
  }

  private addListener = ({ target, event, callback, options = false }: Listener, cb?: () => void) => {
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
    }

    if (mousemove) {
      addListener({
        target: document,
        event: 'mousemove',
        callback: _throttle(this.getMouseMoveRecord, 50)
      })
    }

    _log('mouse observer ready!')
  }

  public uninstall() {
    this.listeners.forEach(({ target, event, callback }) => {
      target.removeEventListener(event, callback)
    })
  }
}
