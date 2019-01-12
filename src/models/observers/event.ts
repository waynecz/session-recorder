import { ElementX } from "..";
import { Record } from ".";

export enum EventTypes {
  scroll = 'scroll',
  resize = 'resize',
  form = 'form'
}

export enum MouseTypes {

  click = 'click',
  move = 'move'
}

export type MouseObserverOptions = {
  click?: boolean 
  mousemove?: boolean
}


export type EventObserveOptions = {
  scroll?: boolean
  resize?: boolean
  form?: boolean
  domsWillScoll?: string[]
}

export type Listener = {
  target: Document | ElementX | Window
  event: string
  callback: EventListenerOrEventListenerObject
  options?: AddEventListenerOptions | boolean
}

export interface EventReocrd extends Record {
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

export interface MouseReocrd extends Record {
  type: MouseTypes
  x?: number
  y?: number
}