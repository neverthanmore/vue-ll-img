import Emitter from '../utils/emitter';
import throttle from '../utils/throttle';
import supportIntersectionObserver from '../utils/supportIntersectionObserver';

const IN_BROWSER = typeof window !== 'undefined';
const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 0
};
class LazyClass extends Emitter {
  constructor(vue, { throttleWait, observerOptions }) {
    super();
    this.listenerQueue = [];
    this.scrollerElementQueue = [];
    this.vue = vue;
    this._observer = null;
    this.options = {
      observerOptions: observerOptions || DEFAULT_OBSERVER_OPTIONS
    };
    this._events['loaded'] = [];
    this.lazyEventHandle = throttle(this._lazyEventHandle, throttleWait || 200);
    this.initMode();
  }

  /**
   *
   */
  _lazyEventHandle() {}

  /**
   * if support IntersectionObserver, use it
   */
  initMode() {
    if (supportIntersectionObserver) {
      this._observer = new IntersectionObserver(this._observerHandler.bind(this), this.options.observerOptions);
    }
  }

  addListener(el, binding, vnode) {}

  updateListener(el, binding, vnode) {}

  removeListener(el) {}
}

export default LazyClass;
