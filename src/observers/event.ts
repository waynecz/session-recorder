import { ElementX, FormELement } from '../models/index'
import { _throttle, _log } from '../tools/helpers'
import SonyA7R3 from '../tools/SonyA7R3'
import { RECORDER_PRESET } from '../constants'
import { Observer, EventReocrd, Listener, EventTypes } from '../models/observers'
import EventDrivenable from '../tools/pub-sub'

const { getRecordIdByElement } = SonyA7R3

/**
 * Observe scroll, window resize, form field value change(input/textarea/radio etc.)
 * and produce an Record
 */
export default class EventObserver extends EventDrivenable implements Observer {
  public listeners: Listener[] = []

  public options = RECORDER_PRESET.event

  constructor(options?: any) {
    super()
    if (typeof options === 'boolean' && options === false) {
      return
    }

    if (typeof options === 'object') {
      this.options = { ...this.options, ...options }
    }
  }

  /**
   * @param option useCapture or AddEventListenerOptions
   */
  public addListener = ({ target, event, callback, options }: Listener, cb?: () => void) => {
    target.addEventListener(event, callback, options)

    this.listeners.push({
      target,
      event,
      callback
    })

    cb && cb()
  }

  // Provide that document's direction is `rtl`(default)
  public getScrollPosition = (): { x: number; y: number } => {
    // Quirks mode on the contrary
    const isStandardsMode = document.compatMode === 'CSS1Compat'

    const x = isStandardsMode ? document.documentElement.scrollLeft : document.body.scrollLeft
    const y = isStandardsMode ? document.documentElement.scrollTop : document.body.scrollTop

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

  public getResizeRecord = (): void => {
    const { clientWidth: w, clientHeight: h } = document.documentElement
    const record: EventReocrd = { type: EventTypes.resize, w, h }
    const { $emit } = this

    $emit('observed', record)
  }

  private getFormChangeRecord = (evt: Event): void => {
    const { target } = evt
    if ((target as HTMLElement).contentEditable === 'true') {
      return
    }
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

    const { scroll, resize, form } = this.options

    if (scroll) {
      addListener({
        target: document,
        event: 'scroll',
        callback: this.getScrollRecord,
        options: true
      })
    }

    if (resize) {
      addListener({
        target: window,
        event: 'resize',
        callback: _throttle(this.getResizeRecord)
      })
    }

    if (form) {
      addListener({
        target: document,
        event: 'change',
        callback: this.getFormChangeRecord,
        options: true
      })

      // input event fires when value of <input> <select> <textarea> element has been altered.
      addListener({
        target: document,
        event: 'input',
        callback: _throttle(this.getFormChangeRecord, 300),
        options: true
      })
    }

    _log('events observer ready!')
  }

  public uninstall() {
    this.listeners.forEach(({ target, event, callback }) => {
      target.removeEventListener(event, callback)
    })
  }
}
