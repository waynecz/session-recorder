import Recorder from 'recorder'
import FridayDocument from 'tools/document'
import { _warn } from 'tools/helpers'
import { ajax } from 'tools/request'
// import 'ui'

class Friday {
  public options = {
    recorder: true,
    ui: true
  }
  public recorder: Recorder
  public installed: boolean = false

  constructor(options?) {
    if (this.installed) {
      _warn('[Friday]: already installed')
      return
    }

    Object.assign(this.options, options)

    this.install()
  }

  /** Identify current user for this feedback */
  public identify() {}

  public startRecord() {
    this.recorder.start()
  }

  public endRecord() {
    this.recorder.end()
  }

  public async report() {
    await ajax({
      url: '://api.firday.ele.me',
      data: this.recorder.trace,
      method: 'POST'
    })
  }

  private install() {
    if (this.options.recorder) {
      this.recorder = new Recorder()
      ;(window as any).__FRIDAY_RECORDER__ = this.recorder
    }

    FridayDocument.init()
  }
}

export default Friday
