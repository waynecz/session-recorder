import { ObserverClass, ObserverConstructorParams } from 'models/observers'
import { EventReocrd, EventTypes } from 'models/observers/event'
import { EventObserveOptions, Listener } from 'models/observers/event'
import { _throttle, _log } from 'tools/helpers'

/**
 * Observe mouse behavior
 * and produce an Record
 **/
export default class MouseObserver implements ObserverClass {
  public name: string = 'MouseObserver'
  public listeners: Listener[] = []
  public onobserved
  public options: EventObserveOptions = {
    click: true,
    mousemove: true
  }
  public status: EventObserveOptions = {
    click: false,
    mousemove: false
  }

  constructor({ onobserved, options }: ObserverConstructorParams) {
    if (options === false) return

    Object.assign(this.options, options)
    this.onobserved = onobserved

    this.install()
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
    const record: EventReocrd = { type: EventTypes.click, x, y }
    const { onobserved } = this

    onobserved && onobserved(record)
  }

  private getMouseMoveRecord = (evt: MouseEvent): void => {
    const { pageX: x, pageY: y } = evt
    const record: EventReocrd = { type: EventTypes.move, x, y }
    const { onobserved } = this

    onobserved && onobserved(record)
  }

  install(): void {
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

    _log('mouse installed!')
  }

  uninstall() {
    this.listeners.forEach(({ target, event, callback }) => {
      target.removeEventListener(event, callback)

      this.status[event] = false
    })
  }
}
