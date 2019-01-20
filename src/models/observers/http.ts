import { Record } from '.'

export enum HttpRockets {
  beacon = 'beacon',
  fetch = 'fetch',
  xhr = 'xhr'
}

export enum HttpEndTypes {
  fetcherror = 'fetcherror',
  fetchend = 'fetchend',
  xhrerror = 'xhrerror',
  xhrabort = 'xhrabort',
  xhrtimeout = 'xhrtimeout',
  xhrend = 'xhrend'
}

export type HttpObserveOptions = {
  beacon?: boolean
  fetch?: boolean
  xhr?: boolean
}

export interface HttpStartRecord extends Record {
  type: HttpRockets
  id?: string // beacon record has no id
  url: string
  input?: any[] // request arguments
  method?: string
}
export interface HttpEndRecord extends Record {
  type: HttpEndTypes
  id: string
  status?: number
  errmsg?: any
}
