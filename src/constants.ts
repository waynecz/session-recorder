import { RecorderOptions } from './models'

export const ID_KEY: string = 'recorder-id'

export const RECORDER_DEFAULT_OPTIONS: RecorderOptions = {
  mutation: true,
  history: true,
  error: {
    jserror: true,
    unhandledrejection: true
  },
  console: {
    info: true,
    error: true,
    log: false,
    warn: true,
    debug: false
  },
  event: {
    scroll: true,
    resize: true,
    form: true
  },
  http: {
    xhr: true,
    fetch: true,
    beacon: true
  },
  mouse: {
    click: true,
    mousemove: false
  }
}
