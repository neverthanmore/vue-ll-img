import Emitter from '../utils/emitter';
import throttle from '../utils/throttle';
import supportIntersectionObserver from '../utils/supportIntersectionObserver';
import assign from '../utils/assign';
import eventBind from '../utils/eventBind';
import remove from '../utils/remove';
import ReactiveListener from './reactiveListener';

const IN_BROWSER = typeof window !== 'undefined';
const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 0
};
const DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'];
const DEFAULT_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const toString = Object.prototype.toString;
class LazyClass extends Emitter {
  constructor(vue, { throttleWait, observerOptions, preLoad, error, loading, listenEventTypes }) {
    super();
    this.listenerQueue = [];
    this.scrollerElementQueue = [];
    this.vue = vue;
    this.silent = vue.config.silent;
    this._observer = null;
    this.options = {
      preLoad: preLoad || 1.3,
      loading: loading || DEFAULT_SRC,
      error: error || DEFAULT_SRC,
      observerOptions: observerOptions || DEFAULT_OBSERVER_OPTIONS,
      listenEventTypes: listenEventTypes || DEFAULT_EVENTS
    };
    this._events['loaded'] = [];
    this.lazyEventHandle = throttle(this._lazyEventHandle.bind(this), throttleWait || 200);
    this.initObserverMode();
  }

  /**
   * if support IntersectionObserver, use it
   */
  initObserverMode() {
    if (supportIntersectionObserver) {
      this._observer = new IntersectionObserver(this._observerHandler.bind(this), this.options.observerOptions);
    }
  }

  _observerHandler(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const listener = this.listenerQueue.find(listener => listener.el === entry.target);
        if (listener.state === 'loaded') return this._observer.unobserve(listener.el);
        listener.load();
      }
    });
  }

  /**
   * check el if in view
   */
  _lazyEventHandle() {
    const delList = [];
    this.listenerQueue.forEach(listener => {
      if (listener.state !== 'loading') return delList.push(listener);
      if (listener.checkInView()) return listener.load();
    });
    delList.forEach(vm => remove(this.listenerQueue, vm));
  }

  addListener(el, binding, vnode) {
    if (this.elInQueue(el)) {
      this.updateListener(el, binding, vode);
      return;
    }

    const { loaded, loading, error } = this.valueFormatter(binding.value);
    this.vue.$nextTick(() => {
      let container = binding.arg;
      let $parent, $parentDom;
      // support refs && id
      if (container) {
        $parent = vnode.context.$refs[container];
        $parentDom = document.getElementById(container);
        /* prettier-ignore */
        $parent = $parent
          ? $parent.$el
          : $parentDom
            ? $parentDom
            : getScrollerParent(el);
        /* prettier-ignore */
      }
      const reactiveListener = new ReactiveListener({
        imgStateSrc: { loaded, loading, error },
        preLoad: this.options.preLoad,
        el,
        $parent
      });
      this.listenerQueue.push(reactiveListener);
      // add event listener target
      this._observer && this._observer.observe(el);
      IN_BROWSER && this.addToScrollerQueue([window, $parent]);

      Vue.$nextTick(this.lazyEventHandle.bind(this));
    });
  }

  updateListener(el, binding, vnode) {
    const { loaded, loading, error } = this.valueFormatter(binding.value);

    const exist = find(this.listenerQueue, item => item.el === el);
    if (exist) {
      exist.update({ loaded, loading, error });
      if (this._observer) {
        this._observer.unobserve(el);
        this._observer.observe(el);
      }
      Vue.nextTick(() => this.lazyLoadHandler());
    } else {
      this.addListener(el, binding, vnode);
    }
  }

  removeListener(el) {
    if (!el) return;
    this._observer && this._observer.unobserve(el);
    const existItem = find(this.listenerQueue, item => item.el === el);
    if (existItem) {
      this._removeListenerTarget(existItem.$parent);
      this._removeListenerTarget(window);
      remove(this.listenerQueue, existItem) && existItem.destroy();
    }
  }

  _removeListenerTarget(el) {
    this.scrollerElementQueue.forEach((target, index) => {
      if (target.el === el) {
        target.childrenCount--;
        if (!target.childrenCount) {
          this.bindLazyEvent(target.el, false);
          this.scrollerElementQueue.splice(index, 1);
          target = null;
        }
      }
    });
  }

  addToScrollerQueue(parent) {
    if (!parent) return;
    let els = Array.isArray(parent) ? parent : [parent];

    els.forEach(el => {
      const target = this.findTarget(el);

      if (target) {
        target.childCount++;
      } else {
        this.scrollerElementQueue.push({
          el,
          childCount: 1
        });
        !this._observer && this.bindLazyEvent(el);
      }
    });
  }

  bindLazyEvent(el, binding) {
    this.options.listenEventTypes.forEach(evt => eventBind[binding ? 'on' : 'off'](el, evt, this.lazyEventHandle));
  }

  elInQueue(el) {
    return this.listenerQueue.some(item => item.el === el);
  }

  findTarget(el) {
    return this.scrollerElementQueue.find(target => target.el === el);
  }

  valueFormatter(value) {
    const imgStateSrc = {
      loaded: '',
      loading: '',
      error: ''
    };
    const { loading, error } = this.options;
    if (toString.call(value) === '[object Object]') {
      assign(imgStateSrc, { loading, error }, value);
    } else {
      Object.assign(imgStateSrc, { loading, error, loaded: value });
    }

    return imgStateSrc;
  }
}

export default LazyClass;
