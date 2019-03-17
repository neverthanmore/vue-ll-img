import Emitter from '../utils/emitter';
class LazyClass extends Emitter {
  constructor(vue, options) {
    super();
    this.listenerQueue = [];
    this.scrollerElementQueue = [];
    this.vue = vue;
    this.options = {};
    this._initEvents();
  }

  /**
   *
   */
  _initEvents() {}
}

export default LazyClass;
