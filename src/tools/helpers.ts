export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type Optional<T> = { [key in keyof T]?: T[key] }

export const _log = console.log.bind(null, '[Friday]: ')

export function _throttle<T, K>(
  func: (T: T) => K,
  wait: number = 100
): (T: T) => K {
  let previous: number = Date.now()

  return function(): K {
    const now = Date.now()
    const restTime = now - previous

    if (restTime >= wait) {
      previous = now
      return func.call(this, ...arguments)
    }
  }
}

// weak uuid
export function _newuuid(): string {
  return Math.random()
    .toString(16)
    .split('.')[1]
}
