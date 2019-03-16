// import LazyClass from './core/lazyClass';
export default {
  install(Vue, options = {}) {
    const isVue2 = Vue.version.slice(0, 1) === 2;

    if (!isVue2 && !Vue.config.silent) {
      console.error('【vue-lazyLoad】The plugin only support Vue2.x, please change your vuejs version!');
      return;
    }

    Vue.directive('lazy-img', {});
  }
};
