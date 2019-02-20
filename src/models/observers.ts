import { ElementX } from './index'

export type Observer = {
  options?: boolean | object

  install(options?: object): void
  uninstall(): void
} & PubSubPattern

export type PubSubPattern = {
  queues: Map<string, Function[]>
  $on(hook: string, action: Function): void
  $off(hook: string, thisAction: Function): void
  $emit(hook: string, ...args): void
}

export interface Record {
  t: number // time
}

export enum ConsoleLevels {
  info = 'info',
  error = 'error',
  log = 'log',
  warn = 'warn',
  debug = 'debug'
}

export enum ConsoleTypes {
  console = 'console'
}

export type ConsoleRecord = {
  type: 'console'
  level: ConsoleLevels // console level,
  input?: any[]
}

export enum EventTypes {
  scroll = 'scroll',
  resize = 'resize',
  form = 'form'
}

export enum MouseTypes {
  click = 'click',
  move = 'move'
}

export type MouseOptions = {
  click?: boolean
  mousemove?: boolean
}

export type EventOptions = {
  scroll?: boolean
  resize?: boolean
  form?: boolean
  domsWillScroll?: string[]
}

export type Listener = {
  target: Window | Document | ElementX
  event: string
  callback: EventListenerOrEventListenerObject
  options?: AddEventListenerOptions | boolean
}

export type EventReocrd = {
  type: EventTypes
  // scroll
  x?: number
  y?: number
  // resize
  w?: number
  h?: number
  // form change
  target?: number
  k?: string
  v?: number | string
}

export type MouseReocrd = {
  type: MouseTypes
  x?: number
  y?: number
}

export enum HistoryTypes {
  history = 'history'
}
export type HistoryRecord = {
  type: HistoryTypes
  from: string // beacon record has no id
  to: string
}

export enum HttpRockets {
  beacon = 'beacon',
  fetch = 'fetch',
  xhr = 'xhr'
}

export enum HttpEndTypes {
  fetcherror = 'fetcherror',
  xhrerror = 'xhrerror',
  xhrabort = 'xhrabort',
  xhrtimeout = 'xhrtimeout'
}

export type HttpOptions = {
  beacon?: boolean
  fetch?: boolean
  xhr?: boolean
}

export type HttpRecord = {
  type: HttpRockets
  url: string
  headers?: { [key: string]: any } // nonexistence in beacon request
  input?: any[] // fetch request payload
  payload?: any // xhr request payload
  response?: any
  method?: string
  status?: number
  errmsg?: any
}

export enum ErrorTypes {
  jserr = 'jserr',
  unhandledrejection = 'unhandledrejection'
}

export type ErrorOptions = {
  jserror: boolean
  unhandledrejection: boolean
}

export type ErrorRecord = {
  type: ErrorTypes
  msg: string
  // fields below existed only when type === jserr
  url?: string
  line?: string
  err?: any
  stack?: string
}

export enum DOMMutationTypes {
  attr = 'attr', // attribute mutate
  node = 'node', // node add or remove
  text = 'text' // text change
}

export interface NodeMutationData {
  index?: number // node's index in parentElement, include textNodes, may exist when add or remove
  type: 'text' | 'ele'
  /* target, exist when node been removed */
  target?: number
  textContent?: string // exist when textNode been removed
  /* index and html here only when it was an add operation */

  html?: string // addnode's html or text
}

export type DOMMutationRecord = {
  type: DOMMutationTypes
  target: number
  // exist when mutation type is attribuites
  attr?: { k: string; v: string }
  // when type is childList
  prev?: number // target's previousSibling's recorderId
  next?: number // nextSibling's recorderId
  add?: NodeMutationData[]
  remove?: NodeMutationData[]
  // when type is characterData
  text?: string
  html?: string
}
