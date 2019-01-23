import { ObserverOptions, RecorderPreset } from './models'

export const ID_KEY: string = 'recorder-id'

export const OBSERVER_DEFAULT_OPTIONS: ObserverOptions = {
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

export const RECORDER_PRESET: RecorderPreset = {
  ...OBSERVER_DEFAULT_OPTIONS,
  maxTimeSpan: 120000 // max time span of trail
}
