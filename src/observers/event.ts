import { HighOrderObserver } from '../models/observers'
import {
  EventObserveOptions,
  Listener,
  EventReocrd,
  EventTypes
} from '../models/observers/event'
import { ElementX, FormELement } from '../models'
import { _throttle, _log } from '../tools/helpers'
import RecorderDocument from '../tools/dom-bufferer'
import BasicObserverClass from './index'
import { RECORDER_OPTIONS } from '../constants'

const { getRecordIdByElement } = RecorderDocument

/**
 * Observe scroll, window resize, form field value change(input/textarea/radio etc.)
 * and produce an Record
 */
export default class EventObserverClass extends BasicObserverClass
  implements HighOrderObserver {
  public name: string = 'EventObserverClass'
  public listeners: Listener[] = []
  public options: EventObserveOptions = RECORDER_OPTIONS.event
  public status: EventObserveOptions = RECORDER_OPTIONS.event

  constructor(options: EventObserveOptions | boolean) {
    super()

    if (options === false) return

    if (typeof options === 'object') {
      this.options = { ...this.options, ...options }
    }
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

  // Provide that document's direction is `rtl`(default)
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

  public getScrollRecord = (evt?: Event): void => {
    const { target } = evt || { target: document }
    const { $emit } = this

    let record = { type: EventTypes.scroll } as EventReocrd

    // 1. target is docuemnt
    // 2. No event invoking
    if (target === document || !target) {
      let { x, y } = this.getScrollPosition()
      record = { ...record, x, y }
      $emit('observed', record)
      return
    }

    let targetX = target as ElementX
    const { scrollLeft: x, scrollTop: y } = targetX
    const recorderId = getRecordIdByElement(targetX)

    record = { ...record, x, y, target: recorderId }

    $emit('observed', record)
  }

  private getResizeRecord = (): void => {
    const { clientWidth: w, clientHeight: h } = document.documentElement
    const record: EventReocrd = { type: EventTypes.resize, w, h }
    const { $emit } = this

    $emit('observed', record)
  }

  private getFormChangeRecord = (evt: Event): void => {
    const { target } = evt
    const recorderId = getRecordIdByElement(target)

    let k: string
    let v: any

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
    const { $emit } = this

    $emit('observed', record)
  }

  public install(): void {
    const { addListener } = this

    const { scroll, resize, form, domsWillScroll } = this.options

    if (scroll) {
      if (Array.isArray(domsWillScroll)) {
        domsWillScroll.forEach(selector => {
          addListener({
            target: document.querySelector(selector),
            event: 'scroll',
            callback: _throttle(this.getScrollRecord),
            options: true
          })
        })
      }

      addListener({
        target: document,
        event: 'scroll',
        callback: _throttle(this.getScrollRecord),
        options: true
      })
      this.status.scroll = true
      // get initial page's scroll position

      this.getScrollRecord()
    }

    if (resize) {
      addListener({
        target: window,
        event: 'resize',
        callback: _throttle(this.getResizeRecord)
      })
      this.status.resize = true
      /** Get viewport size at the begining */
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

    _log('events observer ready!')
  }

  public uninstall() {
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
