import { ObserverClass, EventOptions, Listener } from 'models'
import { _throttle } from 'tools/helpers'

export default class EventObserver implements ObserverClass {
  public name: string = 'EventObserver'
  private listeners: Listener[] = []

  constructor(options: EventOptions, public whenEventBeenFired) {
    this.install(options)
  }

  private addListener({ target, event, callback, options }: Listener) {
    target.addEventListener(event, callback, options)

    this.listeners.push({
      target,
      event,
      callback
    })
  }

  private getScrollRecord(evt: Event): void {}
  private getMouseClickRecord(evt: Event): void {}
  private getMouseMoveRecord(evt: Event): void {}
  private getResizeRecord(evt: Event): void {}
  private getFormChangeRecord(evt: Event): void {}

  install({
    scroll = true,
    click = true,
    move = true,
    resize = true,
    form = true
  }: EventOptions): void {
    if (scroll) {
      this.addListener({
        target: document,
        event: 'scroll',
        callback: this.getScrollRecord,
        options: true
      })
    }
    if (click) {
    }
    if (move) {
    }
    if (resize) {
    }
    if (form) {
    }
  }

  uninstall() {
    this.listeners.forEach(({ target, event, callback }) => {
      target.removeEventListener(event, callback)
    })
  }
}
