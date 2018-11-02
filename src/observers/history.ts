import { ObserverClass } from "models/observers";
import { _original, _log } from "tools/helpers";

export default class HistoryObserver implements ObserverClass {
  public name: string = 'HistoryObserver'
  public active: boolean = false

  constructor(public onobserved) {
    this.install()
  }

  install(): void {
    _log('history installed')
    this.active = true
  }

  uninstall(): void {
    _original(window.history, 'pushState')
    _original(window.history, 'replaceState')
    this.active = false
  }
}