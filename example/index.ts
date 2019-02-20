import SessionRecorder from '../src'

const myRecorder = new SessionRecorder({
  mutation: false
} as any)

const promise = async () => {
  ;(window as any).off()
}

const unhandleReject = () => {
  console.log('reject')
  promise().then(console.log)
}

const start = () => {
  myRecorder.start()

  document.getElementById('errClick').addEventListener('click', () => {
    ;(window as any).then()
  })

  document.getElementById('rejectClick').addEventListener('click', () => {
    unhandleReject()
  })
}

if (['complete', 'interactive'].indexOf(document.readyState) !== -1) {
  start()
} else {
  document.addEventListener('DOMContentLoaded', start)
}
