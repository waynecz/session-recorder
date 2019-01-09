import { ConsoleObserveOptions } from './observers/console'
import { EventObserveOptions, MouseObserverOptions } from './observers/event'
import { HttpObserveOptions } from './observers/http'
import { ErrorObserveOptions } from './observers/error'
import { BasicObserver } from './observers';

export type ElementX = HTMLElement | Element

// MutationRecord's target is Node type that doesn't have `getAttribute`/tagName etc
// HTMLElement > Element > ChildNode > Node
export interface MutationRecordX extends MutationRecord {
  target: HTMLElement
  previousSibling: HTMLElement
  nextSibling: HTMLElement
}

export interface FormELement extends HTMLElement {
  type: string
  value: string
  checked?: boolean
}

export interface MutationWindow extends Window {
  MutationObserver: any
  WebKitMutationObserver: any
}

export declare const window: MutationWindow

export interface RecorderWrappedXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any
  __id__?: string
  __skip_record__?: boolean
}

export type ObserverName =
  | 'mutation'
  | 'console'
  | 'event'
  | 'mouse'
  | 'error'
  | 'history'

export type Observers = { [key in ObserverName]: BasicObserver }

export interface Recorder {
  domTreeBufferer: DomTreeBufferer
  trail: any[]
  observers: Observers
  MAX_TIME: number
  baseTime: number
  options: RecorderOptions
  recording: boolean

  start: () => void
  stop: () => void
  clearTrail: () => void
  pushToTrail: (record: any) => void
}

export type RecorderOptions = {
  console?: ConsoleObserveOptions
  event?: EventObserveOptions
  mouse?: MouseObserverOptions
  http?: HttpObserveOptions
  error?: ErrorObserveOptions
  history?: boolean
  mutation?: boolean
}

export interface DomTreeBufferer {
  domSnapshot: string
  init(): void
}
