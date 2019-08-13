(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.lazyLoad = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * eventBus
   */
  var Emitter =
  /*#__PURE__*/
  function () {
    function Emitter() {
      _classCallCheck(this, Emitter);

      this._events = {};
      this._del = [];
    }

    _createClass(Emitter, [{
      key: "$on",
      value: function $on(event, func) {
        if (!this._events[event]) {
          this._events[event] = [];
        }

        if (this.$has(event, func)) return;

        this._events[event].push(func);
      }
    }, {
      key: "$once",
      value: function $once(event, func) {
        var obj = this;

        function wrapFunc() {
          obj._del.push(wrapFunc);

          func.apply(obj, arguments);
        }

        this.$on(event, wrapFunc);
      }
    }, {
      key: "$off",
      value: function $off(event, func) {
        var listeners = this._events[event];
        if (!listeners || !listeners.length) return;
        var index = listeners.indexOf(func);
        if (index > -1) return listeners.splice(index, 1);
      }
    }, {
      key: "$emit",
      value: function $emit(event) {
        var _this = this;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var listeners = this._events[event];
        (listeners || []).forEach(function (fn) {
          return fn.call.apply(fn, [_this].concat(args));
        });

        this._del.forEach(function (wrapFunc) {
          return _this.$off(event, wrapFunc);
        });

        this._del = [];
      }
    }, {
      key: "$has",
      value: function $has(event, func) {
        var listeners = this._events[event];
        return listeners && listeners.includes(func);
      }
    }]);

    return Emitter;
  }();

  function throttle(fn, wait) {
    var timeout = null;
    var lastRun = 0;
    return function () {
      if (timeout) return;
      var elapsed = Date.now() - lastRun;
      var context = this;
      var args = arguments;

      var runCallback = function runCallback() {
        lastRun = Date.now();
        timeout = null;
        fn.apply(context, args);
      };

      if (elapsed >= wait) {
        runCallback();
      } else {
        timeout = setTimeout(runCallback, wait);
      }
    };
  }

  var supportIntersectionObserver = function () {
    /* eslint-disable */
    if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && window.IntersectionObserverEntry.prototype.hasOwnProperty('intersectionRatio')) {
      // Minimal polyfill for Edge 15's lack of `isIntersecting`
      // See: https://github.com/w3c/IntersectionObserver/issues/211
      if (!window.IntersectionObserverEntry.prototype.hasOwnProperty('isIntersecting')) {
        Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
          get: function get() {
            return this.intersectionRatio > 0;
          }
        });
      }

      return true;
    }
    /* eslint-disable */


    return false;
  }();

  function assign() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.some(function (obj) {
      return Object.prototype.toString.call(obj) !== '[object Object]';
    }) || args.length < 2) return false;
    return args.reduce(function (accumulator, currentValue) {
      var _arr = Object.entries(currentValue);

      for (var _i = 0; _i < _arr.length; _i++) {
        var _arr$_i = _slicedToArray(_arr[_i], 2),
            key = _arr$_i[0],
            value = _arr$_i[1];

        if (value && accumulator.hasOwnProperty(key)) accumulator[key] = value;
      }

      return accumulator;
    });
  }

  var supportPassive = function testSupportsPassive() {
    if (typeof window === 'undefined') return;
    var support = false;

    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          support = true;
        }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {}

    return support;
  }();

  var eventBind = {
    on: function on(el, type, func) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      el.addEventListener(type, func, supportPassive ? {
        passive: true,
        capture: capture
      } : capture);
    },
    off: function off(el) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      el.removeEventListener.apply(el, [type].concat(args));
    }
  };

  function remove(arr, item) {
    if (!Array.isArray(arr) || !arr.length) return;
    var index = arr.indexOf(item);
    if (index > -1) arr.splice(index, 1);
  }

  var imgCache = {};

  var ReactiveListener =
  /*#__PURE__*/
  function () {
    function ReactiveListener(_ref) {
      var imgStateSrc = _ref.imgStateSrc,
          preLoad = _ref.preLoad,
          el = _ref.el,
          $parent = _ref.$parent;

      _classCallCheck(this, ReactiveListener);

      this.img = imgStateSrc;
      this.preLoad = preLoad;
      this.el = el;
      this.$parent = $parent;
      this.performance = {
        init: Date.now(),
        start: 0,
        end: 0
      };

      if ('dataset' in this.el) {
        this.el.dataset.src = this.img.loaded;
      } else {
        this.el.setAttribute('data-src', this.img.loaded);
      }

      this.render('loading');
    }

    _createClass(ReactiveListener, [{
      key: "render",
      value: function render(state) {
        this.state = state;
        this.el.setAttribute('lazy', state);
        this.el.setAttribute('src', this.img[state]);
      }
    }, {
      key: "checkInView",
      value: function checkInView() {
        var rect = this.el.getBoundingClientRect();
        var preLoad = this.preLoad;
        return rect.top < window.innerHeight * preLoad && rect.bottom > 0 && rect.left < window.innerWidth * preLoad && rect.right > 0;
      }
    }, {
      key: "update",
      value: function update(img) {
        var oldVal = this.img.loaded;
        this.img = img;

        if (oldVal === this.img.loaded) {
          this.render('loading');
        }
      }
    }, {
      key: "load",
      value: function load() {
        var _this = this;

        var img = this.img,
            state = this.state;

        if (state === 'loaded' || imgCache[img.loaded]) {
          this.render('loaded');
          return;
        }

        var image = new Image();
        image.src = img.loaded;
        this.performance.start = Date.now();

        image.onload = function () {
          _this.render('loaded');

          imgCache[img.loaded] = 1;
          _this.performance.end = Date.now();
        };

        image.onerror = function (e) {
          console.error(e);

          _this.render('error');
        };
      }
    }, {
      key: "destory",
      value: function destory() {
        this.img = null;
        this.preLoad = null;
        this.el = null;
        this.$parent = null;
      }
    }]);

    return ReactiveListener;
  }();

  function overflow(el) {
    return "".concat(style(el, 'overflow')).concat(style(el, 'overflow-x')).concat(overflow(el, 'overflow-y'));
  }

  function style(el, prop) {
    return window.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prop) : el.style[prop];
  }

  function getScrollerParent (el) {
    if (typeof window === 'undefined') return;
    if (el instanceof HTMLElement) return window;
    var parent = el;

    while (parent) {
      if (parent === document.body || parent === document.documentElement || !parent.parentNode) {
        break;
      }

      if (/(overflow|auto)/.test(overflow(parent))) {
        return parent;
      }

      parent = parent.parentNode;
    }

    return window;
  }

  var IN_BROWSER = typeof window !== 'undefined';
  var DEFAULT_OBSERVER_OPTIONS = {
    rootMargin: '0px',
    threshold: 0
  };
  var DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'];
  var DEFAULT_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  var toString = Object.prototype.toString;

  var LazyClass =
  /*#__PURE__*/
  function (_Emitter) {
    _inherits(LazyClass, _Emitter);

    function LazyClass(vue, _ref) {
      var _this;

      var throttleWait = _ref.throttleWait,
          observerOptions = _ref.observerOptions,
          preLoad = _ref.preLoad,
          error = _ref.error,
          loading = _ref.loading,
          listenEventTypes = _ref.listenEventTypes;

      _classCallCheck(this, LazyClass);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LazyClass).call(this));
      _this.listenerQueue = [];
      _this.scrollerElementQueue = [];
      _this.vue = vue;
      _this.silent = vue.config.silent;
      _this._observer = null;
      _this.options = {
        preLoad: preLoad || 1.3,
        loading: loading || DEFAULT_SRC,
        error: error || DEFAULT_SRC,
        observerOptions: observerOptions || DEFAULT_OBSERVER_OPTIONS,
        listenEventTypes: listenEventTypes || DEFAULT_EVENTS
      }; // Todo event hooks

      _this._events['loaded'] = [];
      _this.lazyEventHandle = throttle(_this._lazyEventHandle.bind(_assertThisInitialized(_this)), throttleWait || 200);

      _this.initObserverMode();

      return _this;
    }
    /**
     * if support IntersectionObserver, use it
     */


    _createClass(LazyClass, [{
      key: "initObserverMode",
      value: function initObserverMode() {
        if (supportIntersectionObserver) {
          this._observer = new IntersectionObserver(this._observerHandler.bind(this), this.options.observerOptions);
        }
      }
    }, {
      key: "_observerHandler",
      value: function _observerHandler(entries) {
        var _this2 = this;

        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var listener = _this2.listenerQueue.find(function (listener) {
              return listener.el === entry.target;
            });

            if (listener) {
              if (listener.state === 'loaded') return _this2._observer.unobserve(listener.el);
              listener.load();
            }
          }
        });
      }
      /**
       * check el if in view
       */

    }, {
      key: "_lazyEventHandle",
      value: function _lazyEventHandle() {
        var _this3 = this;

        var delList = [];
        this.listenerQueue.forEach(function (listener) {
          if (listener.state !== 'loading') return delList.push(listener);
          if (listener.checkInView()) return listener.load();
        });
        delList.forEach(function (vm) {
          return remove(_this3.listenerQueue, vm);
        });
      }
    }, {
      key: "addListener",
      value: function addListener(el, binding, vnode) {
        var _this4 = this;

        if (this.elInQueue(el)) {
          this.updateListener(el, binding, vnode);
          return;
        }

        var _this$valueFormatter = this.valueFormatter(binding.value),
            loaded = _this$valueFormatter.loaded,
            loading = _this$valueFormatter.loading,
            error = _this$valueFormatter.error;

        this.vue.nextTick(function () {
          var container = binding.arg;
          var $parent, $parentDom; // support refs && id

          if (container) {
            $parent = vnode.context.$refs[container];
            $parentDom = document.getElementById(container);
            $parent = $parent ? $parent.$el || $parent : $parentDom;
          }

          if (!$parent) $parent = getScrollerParent(el);
          var reactiveListener = new ReactiveListener({
            imgStateSrc: {
              loaded: loaded,
              loading: loading,
              error: error
            },
            preLoad: _this4.options.preLoad,
            el: el,
            $parent: $parent
          });

          _this4.listenerQueue.push(reactiveListener); // add event listener target


          _this4._observer && _this4._observer.observe(el);

          if (IN_BROWSER) {
            _this4.addToScrollerQueue($parent === window ? window : [window, $parent]);
          }

          _this4.vue.nextTick(_this4.lazyEventHandle.bind(_this4));
        });
      }
    }, {
      key: "updateListener",
      value: function updateListener(el, binding, vnode) {
        var _this5 = this;

        var _this$valueFormatter2 = this.valueFormatter(binding.value),
            loaded = _this$valueFormatter2.loaded,
            loading = _this$valueFormatter2.loading,
            error = _this$valueFormatter2.error;

        var exist = this.find(el);

        if (exist) {
          exist.update({
            loaded: loaded,
            loading: loading,
            error: error
          });

          if (this._observer) {
            this._observer.unobserve(el);

            this._observer.observe(el);
          }

          this.vue.nextTick(function () {
            return _this5.lazyEventHandle();
          });
        } else {
          this.addListener(el, binding, vnode);
        }
      }
    }, {
      key: "removeListener",
      value: function removeListener(el) {
        if (!el) return;
        this._observer && this._observer.unobserve(el);
        var existItem = this.find(el);

        if (existItem) {
          this._removeListenerTarget(existItem.$parent);

          this._removeListenerTarget(window);

          remove(this.listenerQueue, existItem) && existItem.destroy();
        }
      }
    }, {
      key: "_removeListenerTarget",
      value: function _removeListenerTarget(el) {
        var _this6 = this;

        this.scrollerElementQueue.forEach(function (target, index) {
          if (target.el === el) {
            target.childCount--;

            if (!target.childCount) {
              _this6.bindLazyEvent(target.el, false);

              _this6.scrollerElementQueue.splice(index, 1);

              target = null;
            }
          }
        });
      }
    }, {
      key: "addToScrollerQueue",
      value: function addToScrollerQueue(parent) {
        var _this7 = this;

        if (!parent) return;
        var els = Array.isArray(parent) ? parent : [parent];
        els.forEach(function (el) {
          var target = _this7.findTarget(el);

          if (target) {
            target.childCount++;
          } else {
            _this7.scrollerElementQueue.push({
              el: el,
              childCount: 1
            });

            !_this7._observer && _this7.bindLazyEvent(el);
          }
        });
      }
    }, {
      key: "bindLazyEvent",
      value: function bindLazyEvent(el) {
        var _this8 = this;

        var binding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        this.options.listenEventTypes.forEach(function (evt) {
          return eventBind[binding ? 'on' : 'off'](el, evt, _this8.lazyEventHandle);
        });
      }
    }, {
      key: "find",
      value: function find(el) {
        return this.listenerQueue.find(function (item) {
          return item.el === el;
        });
      }
    }, {
      key: "elInQueue",
      value: function elInQueue(el) {
        return this.listenerQueue.some(function (item) {
          return item.el === el;
        });
      }
    }, {
      key: "findTarget",
      value: function findTarget(el) {
        return this.scrollerElementQueue.find(function (target) {
          return target.el === el;
        });
      }
    }, {
      key: "valueFormatter",
      value: function valueFormatter(value) {
        var imgStateSrc = {
          loaded: '',
          loading: '',
          error: ''
        };
        var _this$options = this.options,
            loading = _this$options.loading,
            error = _this$options.error;

        if (toString.call(value) === '[object Object]') {
          assign(imgStateSrc, {
            loading: loading,
            error: error
          }, value);
        } else {
          Object.assign(imgStateSrc, {
            loading: loading,
            error: error,
            loaded: value
          });
        }

        return imgStateSrc;
      }
    }]);

    return LazyClass;
  }(Emitter);

  var index = {
    install: function install(Vue) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var isVue2 = Vue.version.slice(0, 1) == '2';

      if (!isVue2 && !Vue.config.silent) {
        console.error('【vue-lazyLoad】The plugin only support Vue2.x, please change your vuejs version!');
        return;
      }

      var lazyLoad = new LazyClass(Vue, options);
      Vue.prototype.$lazyLoad = lazyLoad;
      Vue.directive('lazy-img', {
        bind: lazyLoad.addListener.bind(lazyLoad),
        update: lazyLoad.updateListener.bind(lazyLoad),
        componentUpdated: lazyLoad.lazyEventHandle.bind(lazyLoad),
        unbind: lazyLoad.removeListener.bind(lazyLoad)
      });
    }
  };

  return index;

}));
