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
  file?: string
  line?: string // `lineo:colno`, only did type is jserr
  msg: string
  err?: any
  stack?: string
}
