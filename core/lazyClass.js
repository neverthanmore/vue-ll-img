import Emitter from '../utils/emitter';
import throttle from '../utils/throttle';
import supportIntersectionObserver from '../utils/supportIntersectionObserver';
import assign from '../utils/assign';
import eventBind from '../utils/eventBind';
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

  addListener(el, binding, vnode) {
    if (this.elInQueue(el)) {
      return;
    }

    const { loaded, loading, error } = this.valueFormatter(binding.value);
    el.setAttribute('lazy', 'loading');
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
        preLoad: this.options.preLoad
      });
      this.listenerQueue.push(reactiveListener);
      // add event listener target
      this._observer && this._observer.observe(el);
      IN_BROWSER && this.addToScrollertQueue([window, $parent]);

      Vue.$nextTick(this.lazyEventHandle.bind(this));
    });
  }

  updateListener(el, binding, vnode) {}

  removeListener(el) {}

  addToScrollertQueue(parent) {
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
