import { ConsoleOptions } from './observers/console'
import { EventOptions, MouseOptions } from './observers/event'
import { HttpOptions } from './observers/http'
import { ErrorOptions } from './observers/error'
import { BasicObserver } from './observers/index'

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

export type ObserverName =
  | 'mutation'
  | 'console'
  | 'event'
  | 'mouse'
  | 'error'
  | 'history'
  | 'http'

export type Observers = { [key in ObserverName]: BasicObserver }

export interface Recorder {
  NikonD7000?: D7000
  trail: any[]
  observers: Observers
  options: RecorderPreset
  recording: boolean

  start: () => void
  stop: () => void
}

export type RecorderPreset = {
  [key in keyof ObserverOptions]: ObserverOptions[key] | boolean
} & { maxTimeSpan: number }

export type ObserverOptions = {
  console?: ConsoleOptions
  event?: EventOptions
  mouse?: MouseOptions
  http?: HttpOptions
  error?: ErrorOptions
  history?: boolean
  mutation?: boolean
}

export interface D7000 {
  latestSnapshot: string
  inited: boolean

  takeSnapshotForPage(): void
}

export * from './observers/index'
