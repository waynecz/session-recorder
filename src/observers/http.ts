import { ObserverClass } from 'models/observers'
import {
  HttpObserveOptions,
  HttpRecord,
  HttpRockets
} from 'models/observers/http'
import { _replace, _original, _newuuid } from 'tools/helpers'
import { ErrorRecord, ErrorTypes } from 'models/observers/error'

export default class RequestObserver implements ObserverClass {
  public name: string = 'RequestObserver'
  public active: boolean
  public options: HttpObserveOptions = {
    beacon: true,
    fetch: true,
    xhr: true
  }

  constructor(public onobserved, options: boolean | HttpObserveOptions) {
    if (options === false) return

    Object.assign(this.options, options)

    this.install()
  }

  private isSupportBeacon(): boolean {
    return !!navigator.sendBeacon
  }

  private hijackBeacon(): void {
    if (!this.isSupportBeacon()) return

    function beaconReplacement(originalBeacon) {
      return function(url: string, data): boolean {
        // Copy from sentry
        // If the browser successfully queues the request for delivery, the method returns "true" and returns "false" otherwise.
        // https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API/Using_the_Beacon_API
        const result: boolean = originalBeacon(url, data)

        const record: HttpRecord = {
          type: 'http',
          r: HttpRockets.beacon,
          url
        }

        this.onobserved(record)

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

        let reocrd = {
          type: 'http',
          r: HttpRockets.fetch,
          method: _method,
          url: _url,
          id: requestId
        } as HttpRecord

        return (
          originalFetch
            .call(window, ...arguments)
            // Not like the XHR, an http error(like 4XX-5XX) will progress into "then" when using fetch,
            // it will reject solely when a network error or CORS misconfigured occurred
            // more: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful
            .then((response: Response) => {
              reocrd.status = response.status

              this.onobserved(reocrd)

              return response
            })
            .catch((error: Error) => {
              const { name: err, message: msg, stack } = error
              const errRecord: ErrorRecord = {
                type: ErrorTypes.unhandlerejection,
                msg,
                err,
                stack
              }

              this.onobserved(errRecord)

              throw error
            })
        )
      }
    }

    _replace(window, 'fetch', fetchReplacement)
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
      this.hijackBeacon()
    }

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
