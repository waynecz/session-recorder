export interface ObserverClass {
  name: string
  status: { [key: string]: boolean } | boolean
  options?: boolean | object

  onobserved?(record: Record): void
  install(options?: object): void
  uninstall(): void
}

export interface ObserverConstructorParams {
  onobserved: any
  options?
}

export enum RecordTypes {
  event = 'event',
  history = 'history'
}

export interface Record {
  t?: number /** parseInt of performance.now() / 100 */
}
