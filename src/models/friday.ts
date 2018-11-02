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


export default interface FridayWrappedXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any
  __id__?: string
  __friday_own__?: string
}