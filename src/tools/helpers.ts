export const _log = console.log.bind(null, '[Recorder]:')
export const _error = console.error.bind(null, '[Recorder]:')
export const _warn = console.warn.bind(null, '[Recorder]:')

export function _now(): number {
  if (!window.performance) return Date.now()
  // if user change local time, performance.now() would work accurate still
  return Math.floor(performance.now())
}

export function _throttle<T, K>(func: (T: T) => K, wait: number = 100): (T: T) => K {
  let previous: number = _now()

  return function(...args: any[]): K {
    const now = _now()
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
 * Wrap and replace a given method with a high-order function
 *
 * @param source The object that contains a method to be wrapped.
 * @param name The name of method to be wrapped
 * @param replacement The function that should be used to wrap the given method
 */
export function _replace(source: object, name: string, replacement: (...args: any[]) => any): void {
  const original = source[name]

  function doReplace() {
    const wrapped = replacement(original)

    wrapped.__recorder__ = true
    wrapped.__recorder_original__ = original

    source[name] = wrapped
  }

  if (original) {
    // if original func existed
    if (!(name in source) || original.__recorder__) return
    doReplace()
    return
  } else if (original === null || original === undefined) {
    // such as window.onerror whose initial value would be null
    // so just do the replacement
    doReplace()
    return
  }
}

/**
 * Reverse to original function
 * @param source The object that contains a method been wrapped.
 * @param name The name of method been wrapped.
 */
export function _recover(source: object, name: string): void {
  if (!(name in source) || !source[name].__recorder__) return

  const { __recorder_original__ } = source[name]

  source[name] = __recorder_original__
}

export function _parseURL(
  href: string = location.href
): {
  host?: string
  path?: string
  protocol?: string
  query?: string
  fragment?: string
  relative?: string
} {
  const match = href.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/)

  if (!match) return {}

  const query = match[6] || ''
  const fragment = match[8] || ''

  return {
    protocol: match[2],
    host: match[4],
    path: match[5],
    query,
    fragment,
    relative: match[5] + query + fragment
  }
}

export function _seralize(obj: { [key: string]: any }): string {
  return Object.keys(obj)
    .map(k => `${k}=${obj[k]}`)
    .join('&')
}
