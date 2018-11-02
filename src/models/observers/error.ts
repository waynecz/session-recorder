import { Record } from '.'

export enum ConsoleLevels {
  info = 'info',
  error = 'error',
  log = 'log',
  warn = 'warn',
  debug = 'debug'
}

export enum ErrorTypes {
  jserr = 'jserr',
  unhandlerejection = 'unhandlerejection'
}

export type ErrorObserveOptions = {
  jserror: boolean
  unhandlerejection: boolean
}

export interface ErrorRecord extends Record {
  type: ErrorTypes
  msg: string
   // fields below existedy only if type === jserr
  file?: string
  line?: string
  err?: any
  stack?: string
}
