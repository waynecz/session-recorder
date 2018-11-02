export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type Optional<T> = { [key in keyof T]?: T[key] }

export const _log = console.log.bind(null, '[Friday]:')

export function _throttle<T, K>(
  func: (T: T) => K,
  wait: number = 100
): (T: T) => K {
  let previous: number = Date.now()

  return function(...args: any[]): K {
    const now = Date.now()
    const restTime = now - previous

    if (restTime >= wait) {
      previous = now
      return func.apply(this, args)
    }
  }
}

// weak uuid
export function _newuuid(): string {
  return Math.random()
    .toString(16)
    .split('.')[1]
}

/**
 * Wrap a given method with a high-order function
 *
 * @param source The object that contains a method to be wrapped.
 * @param name The name of method to be wrapped
 * @param replacement The function that should be used to wrap the given method
 */
export function _replace(
  source: object,
  name: string,
  replacement: (...args: any[]) => any
): void {
  const original = source[name]

  function doReplace() {
    const wrapped = replacement(original)

    wrapped.__firday__ = true
    wrapped.__firday_original__ = original

    source[name] = wrapped
  }

  if (original) {
    // if original func existed
    if (!(name in source) || original.__firday__) return
    doReplace()
  } else if (original === null || original === undefined) {
    // such as window.onerror, it's initial function would be null
    // in this case, do replace directly
    doReplace()
  }
}

/**
 * Reverse to original function
 */
export function _original(source: object, name: string): void {
  if (!(name in source) || !source[name].__firday__) return

  const { __firday_original__ } = source[name]

  source[name] = __firday_original__
}
