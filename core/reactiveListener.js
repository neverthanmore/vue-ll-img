const imgCache = {};
class ReactiveListener {
  constructor({ imgStateSrc, preLoad, el, $parent }) {
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

  render(state) {
    this.state = state;
    this.el.setAttribute('lazy', state);
    this.el.setAttribute('src', this.img[state]);
  }

  checkInview() {
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
    image.src = img.src;
    this.performance.start = Date.now();
    image.onload = () => {
      this.render('loaded');
      imageCache[img.src] = 1;
      this.performance.end = Date.now();
    };
    image.onerror = e => {
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
