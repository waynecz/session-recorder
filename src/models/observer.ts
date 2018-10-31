import { Omit } from 'tools/helpers'

export interface ObserverClass {
  name: string

  whenMutationBeenObserved?<T>(record: T): T
  whenEventBeenFired?<T>(record: T): T
  whenRequestBeenHijacked?<T>(record: T): T

  install(options?: object): void
  uninstall(): void
}

export enum RecordTypes {
  console = 'console',
  event = 'event',
  xhr = 'xhr',
  beacon = 'beacon',
  fetch = 'fetch',
  jserror = 'jserror',
  history = 'history'
}

export enum EventTypes {
  scroll = 'scroll',
  move = 'move',
  click = 'click',
  resize = 'resize',
  form = 'form'
}

export enum DOMMutationTypes {
  attr = 'attr', // attribute mutate
  node = 'node', // node add or remove
  text = 'text' // text change
}

export interface Record {
  t?: number /** performance.now() / 100 */
}

export interface NodeMutationData {
  index?: number // node's index in parentElement, include textNodes
  target?: string // node's fridayId, exist when node been removed
  html: string // addnode's html or text
}

// MutationRecord's target is Node type that doesn't have `getAttribute`/tagName etc
// HTMLElement > Element > ChildNode > Node
export interface MutationRecordX extends MutationRecord {
  target: HTMLElement
  previousSibling: HTMLElement
  nextSibling: HTMLElement
}

export interface DOMRecord extends Record {
  type: DOMMutationTypes
  target: string
  // exist when mutation type is attribuites
  attr?: { k: string; v: string }
  // when type is childList
  prev?: string // target's previousSibling's fridayId
  next?: string // nextSibling's fridayId
  add?: NodeMutationData[]
  remove?: NodeMutationData[]
  // when type is characterData
  text?: string
}

export interface EventReocrd extends Record {
  type: EventTypes
  x?: number
  y?: number
  w?: number
  h?: number

  target?: string
  k?: string
  v?: number | string
}
