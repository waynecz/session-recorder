import { RecorderWrappedXMLHttpRequest } from '../models/index'
import { _replace, _recover, _newuuid, _log, _warn } from '../tools/helpers'
import { isFunction } from '../tools/is'
import { RECORDER_PRESET } from '../constants'
import EventDrivenable from '../tools/pub-sub'
import { Observer, HttpOptions, HttpRockets, HttpRecord } from '../models/observers'

export default class HttpObserver extends EventDrivenable implements Observer {
  public active: boolean
  public options: HttpOptions = RECORDER_PRESET.http

  private xhrRecordMap: Map<string, HttpRecord> = new Map()

  constructor(options?: any) {
    super()

    if (typeof options === 'boolean' && options === false) {
      return
    }

    if (typeof options === 'object') {
      this.options = { ...this.options, ...options }
    }
  }

  private isSupportBeacon(): boolean {
    return !!navigator.sendBeacon
  }

  private hijackBeacon(): void {
    if (!this.isSupportBeacon()) return

    const { $emit } = this

    function beaconReplacement(originalBeacon) {
      return function(this: Navigator, url: string, data): boolean {
        // Copy from sentry javascript
        // If the browser successfully queues the request for delivery, the method returns "true" and returns "false" otherwise.
        // more: https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API/Using_the_Beacon_API
        const result: boolean = originalBeacon.call(this, url, data)

        const record: HttpRecord = {
          type: HttpRockets.beacon,
          url
        }

        $emit('observed', record)

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

    const { $emit } = this

    function fetchReplacement(originalFetch) {
      return function(input: string | Request, config?: Request): void {
        let _method = 'GET'
        let _url: string

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

        const record = {
          type: HttpRockets.fetch,
          method: _method,
          url: _url,
          input: [...arguments]
        } as HttpRecord

        return (
          originalFetch
            .call(window, ...arguments)
            // Not like the XHR, a http error(like 4XX-5XX) will progress into "then" when using fetch,
            // it will reject solely when a network error or CORS misconfigured occurred
            // more: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful
            .then((response: Response) => {
              try {
                record.status = response.status
                record.response = response.clone().json()

                $emit('observed', record)
              } catch (err) {
                _warn(err)
              }

              return response
            })
            .catch((error: Error) => {
              const { message } = error
              record.errmsg = message

              $emit('observed', record)

              throw error
            })
        )
      }
    }

    _replace(window, 'fetch', fetchReplacement)
  }

  private hijackXHR() {
    const { $emit } = this
    const self = this

    function XHROpenReplacement(originalOpen) {
      return function(this: RecorderWrappedXMLHttpRequest, method, url) {
        const requestId = _newuuid()

        const args = [...arguments]

        let record = {
          type: HttpRockets.xhr,
          url,
          method,
          headers: {}
        } as HttpRecord

        this.__id__ = requestId

        self.xhrRecordMap.set(requestId, record)

        return originalOpen.apply(this, args)
      }
    }

    function XHRSetRequestHeaderReplacement(originalSetter) {
      return function(this: RecorderWrappedXMLHttpRequest, key: string, value: any) {
        const requestId = this.__id__
        const record = self.xhrRecordMap.get(requestId)

        if (record) {
          record.headers[key] = value
        }

        originalSetter.call(this, key, value)
      }
    }

    function XHRSendReplacement(originalSend) {
      return function(this: RecorderWrappedXMLHttpRequest, body) {
        const thisXHR = this
        const { __id__: requestId, __skip_record__ } = thisXHR

        let thisRecord = self.xhrRecordMap.get(requestId)

        // skip recorder's own request
        if (thisRecord && !__skip_record__) {
          thisRecord.payload = body
        }

        function onreadystatechangeHandler(): void {
          if (this.readyState === 4) {
            if (this.__skip_record__) return

            const record = self.xhrRecordMap.get(requestId)

            if (record) {
              record.status = thisXHR.status
              // if the responseType is neither 'text' nor ''
              // read responseText would produce an error
              if (thisXHR.responseType === '' || thisXHR.responseType === 'text') {
                record.response = thisXHR.responseText || thisXHR.response
              } else {
                record.response = thisXHR.responseType
              }
              // xhr send successfully
              $emit('observed', record)
            }
          }
        }

        // TODO: hijack xhr.onerror, xhr.onabort, xhr.ontimeout

        if ('onreadystatechange' in thisXHR && isFunction(thisXHR.onreadystatechange)) {
          // if already had a hook
          _replace(thisXHR, 'onreadystatechange', originalStateChangeHook => {
            return (...args) => {
              try {
                onreadystatechangeHandler.call(thisXHR)
              } catch (err) {
                _warn(err)
              }

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

          const record = self.xhrRecordMap.get(requestId)

          if (record) {
            record.errmsg = message
            // xhr send error
            $emit('observed', record)
          }
        }
      }
    }

    const XHRProto = XMLHttpRequest.prototype

    _replace(XHRProto, 'setRequestHeader', XHRSetRequestHeaderReplacement)
    _replace(XHRProto, 'open', XHROpenReplacement)
    _replace(XHRProto, 'send', XHRSendReplacement)
  }

  public install(): void {
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

    _log('http observer ready!')
  }

  public uninstall(): void {
    const { beacon, fetch, xhr } = this.options

    if (beacon) {
      _recover(window.navigator, 'sendBeacon')
    }

    if (fetch) {
      _recover(window, 'fetch')
    }

    if (xhr) {
      this.hijackBeacon()
    }
  }
}
