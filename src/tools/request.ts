import FridayWrappedXMLHttpRequest from 'models/friday'
import { _seralize } from './helpers'

export function ajax({
  url,
  data,
  method = 'GET',
  headers
}: {
  url: string
  data: Object | string
  method: string
  headers?: Object
}): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest() as FridayWrappedXMLHttpRequest
    let body: string
    xhr.__friday_own__ = true

    xhr.open(method, url)

    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    for (let item in headers) {
      if (headers.hasOwnProperty(item) && headers[item] !== null) {
        xhr.setRequestHeader(item, headers[item])
      }
    }

    if (method === 'GET') {
      if (typeof data === 'object') {
        url = url + _seralize(data)
      }
      if (typeof data === 'string') {
        url = url + data
      }
    } else {
      body = JSON.stringify(body)
    }

    xhr.send(body)

    xhr.onerror = function(error) {
      reject(error)
    }

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status.toString().startsWith('2')) {
        try {
          resolve(getBody(xhr))
        } catch (error) {
          reject(error)
        }
      }
    }
  })
}

function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response

  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    return text
  }
}
