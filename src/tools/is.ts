export function isFunction(sth): boolean {
  return typeof sth === 'function'
}

export function isErrorEvent(sth): boolean {
  return Object.prototype.toString.call(sth) === '[object ErrorEvent]'
}

export function isError(sth): boolean {
  switch (Object.prototype.toString.call(sth)) {
    case '[object Error]':
      return true
    case '[object Exception]':
      return true
    case '[object DOMException]':
      return true
    default:
      return sth instanceof Error
  }
}
