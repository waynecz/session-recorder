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

export type HttpOptions = {
  beacon?: boolean
  fetch?: boolean
  xhr?: boolean
}

export interface HttpRecord extends Record {
  type: HttpRockets
  id?: string // beacon record has no id
  url: string
  headers?: { [key: string]: any } // nonexistence in beacon request
  input?: any[] // fetch request payload
  payload?: any // xhr request payload
  response?: any
  method?: string
  status?: number
  errmsg?: any
}
