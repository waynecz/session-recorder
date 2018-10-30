import { Omit } from 'tools/helpers'

export interface ObserverClass {
  name: string
  
  whenMutationBeenObserved?<T>(record: T): T
  whenEventBeenFired?<T>(record: T): T
  whenRequestBeenHijacked?<T>(record: T): T
  
  install(options?: object): void
  uninstall(): void
}

export type EventOptions = {
  scroll: boolean
  click: boolean 
  move: boolean
  resize: boolean
  form: boolean
}

export interface MutationWindow extends Window {
  MutationObserver: any
  WebKitMutationObserver: any
}

export declare const window: MutationWindow

export enum RecordTypes {
  scroll = 'scroll',
  move = 'move',
  click = 'click',
  resize = 'resize',
  form = 'form',
  console = 'console',
  event = 'event',
  xhr = 'xhr',
  beacon = 'beacon',
  fetch = 'fetch',
  jserror = 'jserror',
  history = 'history'
}

export enum DOMRecordTypes {
  attr = 'attr',
  node = 'node',
  text = 'text'
}

export interface Record {
  type: RecordTypes
  t: number /** performance.now() / 100 */
}

export interface NodeX {
  index?: number // node's index in parentElement, include textNodes
  target?: string // node's fridayId, exist when node been removed
  html: string // addnode's html or text
}

export type ElementX = Document | HTMLElement | Element

// MutationRecord's target is Node type that doesn't have `getAttribute`/tagName etc
// HTMLElement > Element > ChildNode > Node
export interface MutationRecordX extends MutationRecord {
  target: HTMLElement
  previousSibling: HTMLElement
  nextSibling: HTMLElement
}

export interface DOMRecord extends Omit<Record, 'type'> {
  type: DOMRecordTypes
  target: string
  // exist when mutation type is attribuites
  attr?: { k: string, v: string }
  // when type is childList
  prev?: string // target's previousSibling's fridayId
  next?: string // nextSibling's fridayId
  add?: NodeX[]
  remove?: NodeX[]
  // when type is characterData
  text?: string
}


export type Listener = {
  target: ElementX
  event: string
  callback: EventListenerOrEventListenerObject
  options?: AddEventListenerOptions | boolean
}