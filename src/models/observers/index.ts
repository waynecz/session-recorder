export interface ObserverClass {
  name: string
  options?: boolean | object
  onobserved?<T>(record: T): T
  install(options?: object): void
  uninstall(): void
}

export enum RecordTypes {
  event = 'event',
  xhr = 'xhr',
  beacon = 'beacon',
  fetch = 'fetch',
  jserror = 'jserror',
  history = 'history'
}

export interface Record {
  t?: number /** parseInt of performance.now() / 100 */
}

export interface ObserveHooks {
  onobserved?<T>(record: T): T
}
