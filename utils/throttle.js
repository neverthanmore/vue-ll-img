export default function throttle(fn, wait) {
  let timeout = null;
  let lastRun = 0;
  return function() {
    if (timeout) return;
    let elapsed = Date.now() - lastRun;
    let context = this;
    let args = arguments;

    const runCallback = function() {
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
