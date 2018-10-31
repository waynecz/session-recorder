export type ElementX = HTMLElement | Element

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
