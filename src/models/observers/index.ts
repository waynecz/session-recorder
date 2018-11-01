export interface ObserverClass {
  name: string
  active: boolean,
  options?: boolean | object
  onobserved?(record: Record)
  install(options?: object): void
  uninstall(): void
}

export enum RecordTypes {
  event = 'event',
  history = 'history'
}

export interface Record {
  t?: number /** parseInt of performance.now() / 100 */
}