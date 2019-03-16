/**
 * eventBus
 */

export default class Emitter {
  constructor() {
    this._events = {};
    this._del = [];
  }

  $on(event, func) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    if (this.$has(event, func)) return;
    this._events[event].push(func);
  }

  $once(event, func) {
    const obj = this;
    function wrapFunc() {
      obj._del.push(wrapFunc);
      func.apply(obj, arguments);
    }

    this.$on(event, wrapFunc);
  }

  $off(event, func) {
    const listeners = this._events[event];
    if (!listeners || !listeners.length) return;
    const index = listeners.indexOf(func);
    if (index > -1) return listeners.splice(index, 1);
  }

  $emit(event, ...args) {
    const listeners = this._events[event];
    (listeners || []).forEach(fn => fn.call(this, ...args));
    this._del.forEach(wrapFunc => this.$off(event, wrapFunc));
    this._del = [];
  }

  $has(event, func) {
    const listeners = this._events[event];
    return listeners && listeners.includes(func);
  }
}
