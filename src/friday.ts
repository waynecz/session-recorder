import Recorder from 'recorder'
import FridayDocument from 'tools/document'
// import 'ui'

class Friday {
  public options = {
    recorder: true,
    ui: true
  }

  public installed: boolean = false

  constructor(options?) {
    if (this.installed) {
      console.warn('[Friday]: already installed')
      return
    }

    Object.assign(this.options, options)

    if (this.options.recorder) {
      ;(window as any).__FRIDAY_RECORDER__ = new Recorder()
    }

    FridayDocument.init()
  }

  public identity() {}

  public startRecord() {
    
  }

  private install() {}
}

export default Friday
