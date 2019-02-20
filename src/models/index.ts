import { Observer } from './observers'

export type ElementX = HTMLElement | Element

// MutationRecord's target is Node type that doesn't have `getAttribute` / `tagName` etc
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
  MutationObserver?: any
  WebKitMutationObserver?: any
}

export const myWindow: MutationWindow = window

export interface RecorderWrappedXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any
  __id__?: string
  __skip_record__?: boolean
}

export type ObserverName = 'mutation' | 'console' | 'event' | 'mouse' | 'error' | 'history' | 'http'

export type Observers = { [key in ObserverName]: Observer }

export interface Recorder {
  SonyA7R3?: SonyA7R3
  trail: any[]
  observers: Observers
  options: any
  recording: boolean

  start: () => void
  stop: () => void
}

export interface SonyA7R3 {
  inited: boolean

  latestSnapshot: string

  takeSnapshotForPage(): void
}
