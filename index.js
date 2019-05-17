import LazyClass from './core/lazyClass';

export default {
  install(Vue, options = {}) {
    const isVue2 = Vue.version.slice(0, 1) == '2';

    if (!isVue2 && !Vue.config.silent) {
      console.error('【vue-lazyLoad】The plugin only support Vue2.x, please change your vuejs version!');
      return;
    }

    const lazyLoad = new LazyClass(Vue, options);
    Vue.prototype.$lazyLoad = lazyLoad;
    Vue.directive('lazy-img', {
      bind: lazyLoad.addListener.bind(lazyLoad),
      update: lazyLoad.updateListener.bind(lazyLoad),
      componentUpdated: lazyLoad.lazyEventHandle.bind(lazyLoad),
      unbind: lazyLoad.removeListener.bind(lazyLoad)
    });
  }
};
