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
  reject = 'reject'
}

export type ErrorObserveOptions = {
  jserror: boolean
  unhandlerejection: boolean
}

export interface ErrorRecord extends Record {
  type: ErrorTypes
  file?: string
  line?: string // `lineo:colno`
  msg: string
  err?: any
  // exist in promise rejection
  reason?: any
}
