const supportPassive = (function testSupportsPassive() {
  if (typeof window === 'undefined') return;
  let support = false;
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function() {
        support = true;
      }
    });
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch (e) {}
  return support;
})();

const eventBind = {
  on(el, type, func, capture = false) {
    el.addEventListener(type, func, supportPassive ? { passive: true, capture } : capture);
  },

  off(el, type, ...args) {
    el.removeEventListener(type, ...args);
  }
};

export default eventBind;
