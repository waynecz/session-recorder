import { Record } from ".";

export enum DOMMutationTypes {
  attr = 'attr', // attribute mutate
  node = 'node', // node add or remove
  text = 'text' // text change
}

export interface NodeMutationData {
  index?: number // node's index in parentElement, include textNodes, may exist when add or remove
  type: 'text' | 'ele'
  /** target, exist when node been removed */
  target?: number 
  remaining?: string // exist when textNode been removed
  /** index and html here only when it was an add operation */ 
  html?: string // addnode's html or text
}

export interface DOMMutationRecord extends Record {
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
