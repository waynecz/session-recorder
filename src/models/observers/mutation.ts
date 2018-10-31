import { Record } from ".";

export enum DOMMutationTypes {
  attr = 'attr', // attribute mutate
  node = 'node', // node add or remove
  text = 'text' // text change
}

export interface NodeMutationData {
  index?: number // node's index in parentElement, include textNodes
  target?: string // node's fridayId, exist when node been removed
  html: string // addnode's html or text
}

export interface DOMMutationRecord extends Record {
  type: DOMMutationTypes
  target: string
  // exist when mutation type is attribuites
  attr?: { k: string; v: string }
  // when type is childList
  prev?: string // target's previousSibling's fridayId
  next?: string // nextSibling's fridayId
  add?: NodeMutationData[]
  remove?: NodeMutationData[]
  // when type is characterData
  text?: string
}
