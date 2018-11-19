import { ObserverClass, ObserverConstructorParams } from '../models/observers'
import { EventReocrd, EventTypes } from '../models/observers/event'
import { EventObserveOptions, Listener } from '../models/observers/event'
import { ElementX, FormELement } from '../models'
import { _throttle, _log } from '../tools/helpers'
import RecorderDocument from '../tools/document'

const { getRecordIdByElement } = RecorderDocument

/**
 * Observe scroll, window resize, form change(input/textarea/radio etc.)
 * and produce an Record
 **/
export default class EventObserver implements ObserverClass {
  public name: string = 'EventObserver'
  public listeners: Listener[] = []
  public onobserved
  public options: EventObserveOptions = {
    scroll: true,
    resize: true,
    form: true
  }
  public status: EventObserveOptions = {
    scroll: false,
    resize: false,
    form: false
  }

  constructor({ onobserved, options }: ObserverConstructorParams) {
    if (options === false) return

    Object.assign(this.options, options)
    this.onobserved = onobserved

    this.install()
  }

  /**
   * @param option useCapture or AddEventListenerOptions
   */
  public addListener = (
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

  /** Provide that Document's direction is `rtl`(default) */
  private getScrollPosition = (): { x: number; y: number } => {
    // Quirks mode on the contrary
    const isStandardsMode = document.compatMode === 'CSS1Compat'

    const x = isStandardsMode
      ? document.documentElement.scrollLeft
      : document.body.scrollLeft
    const y = isStandardsMode
      ? document.documentElement.scrollTop
      : document.body.scrollTop

    return { x, y }
  }

  private getScrollRecord = (evt?: Event): void => {
    const { target } = evt || { target: document }
    const { onobserved } = this

    let record = { type: EventTypes.scroll } as EventReocrd

    // If 1. target is docuemnt / 2. Non-event invoking
    if (target === document || !target) {
      let { x, y } = this.getScrollPosition()
      record = { ...record, x, y }
      onobserved && onobserved(record)
      return
    }

    let targetX = target as ElementX
    const { scrollLeft: x, scrollTop: y } = targetX
    const recorderId = getRecordIdByElement(targetX)

    record = { ...record, x, y, target: recorderId }

    onobserved && onobserved(record)
  }

  private getResizeRecord = (): void => {
    const { clientWidth: w, clientHeight: h } = document.documentElement
    const record: EventReocrd = { type: EventTypes.resize, w, h }
    const { onobserved } = this

    onobserved && onobserved(record)
  }

  private getFormChangeRecord = (evt: Event): void => {
    const { target } = evt
    const recorderId = getRecordIdByElement(target)

    let k, v

    if (!recorderId) return

    const itemsWhichKeyIsChecked = ['radio', 'checked']

    const targetX = target as FormELement
    const { type: formType } = targetX
    if (itemsWhichKeyIsChecked.includes(formType)) {
      k = 'checked'
      v = targetX.checked
    } else {
      k = 'value'
      v = targetX.value
    }

    const record: EventReocrd = {
      type: EventTypes.form,
      target: recorderId,
      k,
      v
    }
    const { onobserved } = this

    onobserved && onobserved(record)
  }

  install(): void {
    const { addListener } = this

    const { scroll, resize, form } = this.options

    if (scroll) {
      addListener({
        target: document,
        event: 'scroll',
        callback: _throttle(this.getScrollRecord),
        options: true
      })
      this.status.scroll = true
      /** Non-event invoking in order to get initial document's scroll position */
      this.getScrollRecord()
    }

    if (resize) {
      addListener({
        target: window,
        event: 'resize',
        callback: _throttle(this.getResizeRecord)
      })
      this.status.resize = true
      /** Get viewport size primitively */
      this.getResizeRecord()
    }

    if (form) {
      addListener({
        target: document,
        event: 'change',
        callback: this.getFormChangeRecord,
        options: true
      })
      this.status.form = true
    }

    _log('events installed!')
  }

  uninstall() {
    const eventName2StatusKey = {
      change: 'form'
    }

    this.listeners.forEach(({ target, event, callback }) => {
      target.removeEventListener(event, callback)

      const statusKey = eventName2StatusKey[event] || event

      this.status[statusKey] = false
    })
  }
}
