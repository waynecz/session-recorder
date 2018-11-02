import { Record } from ".";

export enum ConsoleLevels {
  info = 'info',
  error = 'error',
  log = 'log',
  warn = 'warn',
  debug = 'debug'
}

export enum ConsoleTypes {
  console = 'console'
}

export type ConsoleObserveOptions = {
  info?: boolean
  warn?: boolean
  error?: boolean
  debug?: boolean
  log?: boolean
}

export interface ConsoleRecord extends Record {
  type: ConsoleTypes,
  l: ConsoleLevels // console level,
  msg?: any[]
}