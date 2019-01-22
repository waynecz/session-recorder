import { Record } from '.'

export enum ErrorTypes {
  jserr = 'jserr',
  unhandledrejection = 'unhandledrejection'
}

export type ErrorOptions = {
  jserror: boolean
  unhandledrejection: boolean
}

export interface ErrorRecord extends Record {
  type: ErrorTypes
  msg: string
  // fields below existed only when type === jserr
  url?: string
  line?: string
  err?: any
  stack?: string
}
