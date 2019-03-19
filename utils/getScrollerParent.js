function overflow(el) {
  return `${style(el, 'overflow')}${style(el, 'overflow-x')}${overflow(el, 'overflow-y')}`;
}

function style(el, prop) {
  return window.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prop) : el.style[prop];
}

export default function(el) {
  if (typeof window === 'undefined') return;
  if (el instanceof HTMLElement) return window;

  let parent = el;
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
