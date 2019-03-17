const supportIntersectionObserver = (() => {
  /* eslint-disable */
  if (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    window.IntersectionObserverEntry.prototype.hasOwnProperty('intersectionRatio')
  ) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!window.IntersectionObserverEntry.prototype.hasOwnProperty('isIntersecting')) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get() {
          return this.intersectionRatio > 0;
        }
      });
    }
    return true;
  }
  /* eslint-disable */
  return false;
})();

export default supportIntersectionObserver;
