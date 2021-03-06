const imgCache = {};
class ReactiveListener {
  constructor({ imgStateSrc, preLoad, el, $parent, bindingType }) {
    this.img = imgStateSrc;
    this.preLoad = preLoad;
    this.el = el;
    this.$parent = $parent;
    this.bindingType = bindingType;

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

  render(state) {
    const { el, bindingType } = this;
    const img = this.img[state];
    this.state = state;
    el.setAttribute('lazy', state);
    if (bindingType) {
      el.style[bindingType] = `url("${img}")`;
    } else {
      el.setAttribute('src', img);
    }
  }

  checkInView() {
    const rect = this.el.getBoundingClientRect();
    const preLoad = this.preLoad;
    return (
      rect.top < window.innerHeight * preLoad &&
      rect.bottom > 0 &&
      (rect.left < window.innerWidth * preLoad && rect.right > 0)
    );
  }

  update(img) {
    const oldVal = this.img.loaded;
    this.img = img;
    if (oldVal === this.img.loaded) {
      this.render('loading');
    }
  }

  load() {
    const { img, state } = this;

    if (state === 'loaded' || imgCache[img.loaded]) {
      this.render('loaded');
      return;
    }

    let image = new Image();
    image.src = img.loaded;
    this.performance.start = Date.now();
    image.onload = () => {
      this.render('loaded');
      imgCache[img.loaded] = 1;
      this.performance.end = Date.now();
    };
    image.onerror = e => {
      console.error(e);
      this.render('error');
    };
  }

  destory() {
    this.img = null;
    this.preLoad = null;
    this.el = null;
    this.$parent = null;
  }
}

export default ReactiveListener;
