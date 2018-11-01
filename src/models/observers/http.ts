import { Record } from '.'

export enum HttpRockets {
  beacon = 'beacon',
  fetch = 'fetch',
  xhr = 'xhr',
}

export type HttpObserveOptions = {
  beacon: boolean,
  fetch: boolean,
  xhr: boolean,
}

export interface HttpRecord extends Record {
  type: 'http'
  r: HttpRockets
  id: string
  url: string
  method?: string
  status?: number
}

export interface HttpErrorRecord extends Record {
  type: 'http'
  r: HttpRockets
  id: string
  url: string
  method?: string
  status?: number
}

