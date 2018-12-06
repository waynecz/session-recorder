import { isFunction } from "../tools/is";
import { BasicObserver } from "../models/observers";

export default class BasicObserverClass implements BasicObserver {
  public queues: Map<string, Function[]> = new Map();

  public $on = (hook: string, action: Function): void => {
    const { queues } = this;
    const existingQ = queues.get(hook) || [];

    queues.set(hook, [...existingQ, action]);
  }

  public $off = (hook: string, thisAction: Function): void => {
    const Q = this.queues.get(hook) || [];
    if (!Q.length) {
      return;
    }

    const index = Q.indexOf(thisAction);

    if (index !== -1) {
      Q.splice(index, 1);
      this.queues.set(hook, Q);
    }
  }

  public $emit = (hook: string, ...args): void => {
    const Q = this.queues.get(hook) || [];
    if (!Q.length) {
      return;
    }

    Q.forEach(action => {
      if (isFunction(action)) {
        action(...args);
      }
    });
  }
}