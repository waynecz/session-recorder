import { ElementX } from "../friday";
import { Record } from ".";

export enum EventTypes {
  scroll = 'scroll',
  move = 'move',
  click = 'click',
  resize = 'resize',
  form = 'form'
}

export type EventObserveOptions = {
  scroll?: boolean
  click?: boolean 
  mousemove?: boolean
  resize?: boolean
  form?: boolean
}

export type Listener = {
  target: Document | ElementX | Window
  event: string
  callback: EventListenerOrEventListenerObject
  options?: AddEventListenerOptions | boolean
}

export interface EventReocrd extends Record {
  type: EventTypes
  // click, move, scroll
  x?: number
  y?: number
  // resize
  w?: number
  h?: number
  // form change
  target?: string
  k?: string
  v?: number | string
}