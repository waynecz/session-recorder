import { ObserverClass } from 'models/observers'
import {
  HttpObserveOptions,
  HttpRockets,
  HttpStartRecord,
  HttpEndRecord,
  HttpEndTypes
} from 'models/observers/http'
import { _replace, _original, _newuuid, _log } from 'tools/helpers'
import FridayWrappedXMLHttpRequest from 'models/friday'
import { isFunction } from 'tools/is'

export default class HttpObserver implements ObserverClass {
  public name: string = 'HttpObserver'
  public active: boolean
  public options: HttpObserveOptions = {
    beacon: true,
    fetch: true,
    xhr: true
  }
  public xhrMap: Map<string, HttpStartRecord> = new Map()

  constructor(public onobserved, options?: boolean | HttpObserveOptions) {
    if (options === false) return

    Object.assign(this.options, options)

    this.install()
  }

  private isSupportBeacon(): boolean {
    return !!navigator.sendBeacon
  }

  private hijackBeacon(): void {
    if (!this.isSupportBeacon()) return

    const _self = this

    function beaconReplacement(originalBeacon) {
      return function(url: string, data): boolean {
        // Copy from sentry
        // If the browser successfully queues the request for delivery, the method returns "true" and returns "false" otherwise.
        // more: https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API/Using_the_Beacon_API
        const result: boolean = originalBeacon(url, data)

        const record: HttpStartRecord = {
          type: HttpRockets.beacon,
          url
        }

        _self.onobserved(record)

        return result
      }
    }

    _replace(window.navigator, 'sendBeacon', beaconReplacement)
  }

  private isSupportFetch(): boolean {
    return window.fetch && window.fetch.toString().includes('native')
  }

  private hijackFetch(): void {
    if (!this.isSupportFetch()) return

    const _self = this

    function fetchReplacement(originalFetch) {
      return function(input: string | Request, config?: Request): void {
        const requestId = _newuuid()

        let _method = 'GET'
        let _url

        if (typeof input === 'string') {
          _url = input
        } else if (input instanceof Request) {
          const { method, url } = input
          _url = url
          if (method) _method = method
        } else {
          _url = String(input)
        }

        if (config && config.method) {
          _method = config.method
        }

        let startReocrd = {
          type: HttpRockets.fetch,
          method: _method,
          url: _url,
          id: requestId,
          input: [...arguments]
        } as HttpStartRecord

        // record before fetch
        _self.onobserved(startReocrd)

        return (
          originalFetch
            .call(window, ...arguments)
            // Not like the XHR, a http error(like 4XX-5XX) will progress into "then" when using fetch,
            // it will reject solely when a network error or CORS misconfigured occurred
            // more: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful
            .then((response: Response) => {
              let endReocrd = {
                type: HttpEndTypes.fetchend,
                id: requestId
              } as HttpEndRecord

              endReocrd.status = response.status

              _self.onobserved(endReocrd)

              return response
            })
            .catch((error: Error) => {
              const { message } = error
              const errRecord: HttpEndRecord = {
                type: HttpEndTypes.fetcherror,
                id: requestId,
                errmsg: message
              }

              _self.onobserved(errRecord)

              throw error
            })
        )
      }
    }

    _replace(window, 'fetch', fetchReplacement)
  }

  private hijackXHR() {
    if (!('XMLHttpRequest' in window)) return

    const _self = this

    function XHROpenReplacement(originalOpen) {
      return function(this: FridayWrappedXMLHttpRequest, method, url) {
        const requestId = _newuuid()

        const args = [...arguments]

        let startRecord = {
          type: HttpRockets.xhr,
          id: requestId,
          url,
          method,
          input: args
        } as HttpStartRecord

        this.__id__ = requestId

        _self.xhrMap.set(requestId, startRecord)

        return originalOpen.apply(this, args)
      }
    }

    function XHRSendReplacement(originalSend) {
      return function(this: FridayWrappedXMLHttpRequest, body) {
        const thisXHR = this
        const { __id__: requestId, __friday_own__ } = thisXHR

        let startRecord = _self.xhrMap.get(requestId)

        // skip firday's own request
        if (startRecord && !__friday_own__) {
          startRecord.input = body
          // record before send
          _self.onobserved(startRecord)
        }

        function onreadystatechangeHandler(): void {
          if (thisXHR.readyState === 4) {
            if (thisXHR.__friday_own__) return
          }
          const endRecord: HttpEndRecord = {
            type: HttpEndTypes.xhrend,
            id: requestId,
            status: thisXHR.status
          }

          _self.onobserved(endRecord)
        }

        // TODO: hijack xhr.onerror, xhr.onabort, xhr.ontimeout

        if (
          'onreadystatechange' in thisXHR &&
          isFunction(thisXHR.onreadystatechange)
        ) {
          // if already had a hook
          _replace(thisXHR, 'onreadystatechange', originalStateChangeHook => {
            return (...args) => {
              onreadystatechangeHandler.call(thisXHR)
              originalStateChangeHook.call(thisXHR, ...args)
            }
          })
        } else {
          thisXHR.onreadystatechange = onreadystatechangeHandler
        }

        try {
          return originalSend.call(this, body)
        } catch (exception) {
          // if an exception occured after send, count in thisXHR
          const { message } = exception as TypeError | RangeError | EvalError
          const errRecord: HttpEndRecord = {
            type: HttpEndTypes.xhrerror,
            id: requestId,
            errmsg: message
          }

          _self.onobserved(errRecord)
        }
      }
    }

    const XHRProto = XMLHttpRequest.prototype

    _replace(XHRProto, 'open', XHROpenReplacement)
    _replace(XHRProto, 'send', XHRSendReplacement)
  }

  install(): void {
    const { beacon, fetch, xhr } = this.options

    if (beacon) {
      this.hijackBeacon()
    }

    if (fetch) {
      this.hijackFetch()
    }

    if (xhr) {
      this.hijackXHR()
    }

    _log('http installed!')

    // TODO: specify active status to beacon-actived, fetch-actived...
    this.active = true 
  }

  uninstall(): void {
    const { beacon, fetch, xhr } = this.options

    if (beacon) {
      _original(window.navigator, 'sendBeacon')
    }

    if (fetch) {
      _original(window, 'fetch')
    }

    if (xhr) {
      this.hijackBeacon()
    }

    this.active = false
  }
}
