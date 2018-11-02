import Recorder from 'recorder'
// import 'ui'

class Friday {
  constructor() {
    (window as any).__FRIDAY_RECORDER__ = new Recorder()
  }
}

export default new Friday()