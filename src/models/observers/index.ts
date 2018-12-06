export interface HighOrderObserver {
  name: string
  status: { [key: string]: boolean } | boolean
  options?: boolean | object

  onobserved?(record: Record): void
  install(options?: object): void
  uninstall(): void
}

export interface BasicObserver {
  queues: Map<string, Function[]>
  $on(hook: string, action: Function): void
  $off(hook: string, thisAction: Function): void
  $emit(hook: string, ...args): void
}


export interface Record {
  t?: number // time
  type: string
}
