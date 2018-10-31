import { ElementX } from "./friday";

export type EventObserveOptions = {
  scroll: boolean
  click: boolean 
  move: boolean
  resize: boolean
  form: boolean
}

export type Listener = {
  target: Document | ElementX | Window
  event: string
  callback: EventListenerOrEventListenerObject
  options?: AddEventListenerOptions | boolean
}