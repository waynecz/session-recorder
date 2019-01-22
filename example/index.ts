import SessionRecorder from '../src'

const myRecorder = new SessionRecorder({
  http: { xhr: false, fetch: false },
  mutation: false,
  console: false
} as any)

const start = () => {
  myRecorder.start()
}

if (['complete', 'interactive'].indexOf(document.readyState) !== -1) {
  start()
} else {
  document.addEventListener('DOMContentLoaded', start)
}
