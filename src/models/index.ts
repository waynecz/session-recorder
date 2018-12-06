import { ConsoleObserveOptions } from './observers/console'
import { EventObserveOptions, MouseObserverOptions } from './observers/event'
import { HttpObserveOptions } from './observers/http'
import { ErrorObserveOptions } from './observers/error'

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

export interface Recorder {
  docBufferer: DocumentBufferer
  trail: any[]
  observers: { [key: string]: any }
  MAX_TIME: number
  baseTime: number
  options: RecorderOptions
  recording: boolean
  start: () => void 
  stop: () => void 
  pushToTrail: (record: any) => void 
}

export interface RecorderOptions {
  console?: ConsoleObserveOptions
  event?: EventObserveOptions
  mouse?: MouseObserverOptions
  http?: HttpObserveOptions
  error?: ErrorObserveOptions
  history?: boolean
  mutation?: boolean
}

export interface DocumentBufferer {
  domSnapshot: string
}