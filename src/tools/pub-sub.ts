import { isFunction } from './is'
import { PubSubPattern } from '../models/observers'

export default class EventDrivenable implements PubSubPattern {
  public queues: Map<string, Function[]> = new Map()

  public $on = (hook: string, action: Function): void => {
    const { queues } = this
    const existingTasks = queues.get(hook) || []

    queues.set(hook, [...existingTasks, action])
  }

  public $off = (hook: string, thisAction: Function): void => {
    const Q = this.queues.get(hook) || []
    if (!Q.length) {
      return
    }

    const index = Q.indexOf(thisAction)

    if (index !== -1) {
      Q.splice(index, 1)
      this.queues.set(hook, Q)
    }
  }

  public $emit = (hook: string, ...args): void => {
    const Q = this.queues.get(hook) || []
    if (!Q.length) {
      return
    }
    try {
      Q.forEach(action => {
        if (isFunction(action)) {
          action(...args)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
