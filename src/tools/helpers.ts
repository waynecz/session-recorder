export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type Optional<T> = { [key in keyof T]?: T[key] }

export const _log = console.log.bind(null, '[Friday]: ')

export function _throttle(func, wait?: number = 100, options?): Function  {
  let context, args, result
  let timeout = null

  return function() {

  }
}