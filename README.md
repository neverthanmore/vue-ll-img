# vue-ll-img
vue image lazyLoad



# Requirements

- 2.x



# Installation

```bash
$ npm i @kaola-mkt/vue-ll-img -S
```



# Usage

main.js or plugin.js

```js
import Vue from 'vue'
import lazy from '@kaola-mkt/vue-ll-img'

Vue.use(lazy, {
    loading: 'haitao.nos.com/loading.png',
    error: 'haitao.nos.com/error.png'
})
```



| key              | description                    | default                                                      | options |
| ---------------- | ------------------------------ | ------------------------------------------------------------ | ------- |
| preload          | 预加载高度                     | 1.3                                                          | Number  |
| loading          | loading图                      |                                                              | String  |
| Error            | 图片加载失败图                 |                                                              | String  |
| observerOptions  | IntersectionObserver's options | { rootMargin: '0px', threshold: 0.1 }                        | Object  |
| listenEventTypes | 监听的事件                     | ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'] | Array   |

template

```html
<div class="lazy">
    <img v-for="(v, i) in imgs" v-lazy-img="v" :key="i" />
</div>
```

```html
<div v-lazy-img.background-image="aaa.png"></div>
```



如果没有设置滚动的元素，会为每一个listener去寻找滚动的父元素。

当然你也可以如下方式设置父元素：

```html
<div id="lazy" ref="lazy">
    <img v-for="(v, i) in imgs" v-lazy-img:lazy="v" :key="i" />
</div>
```

tips:  `binding.arg` 需要等于父元素的`ref`，没有设置`ref`，会去找`id` 与`binding.arg`相等的元素



# css state

渲染过程中为`img`标签打上三种状态 `loading`、`loaded`、`error`



```html
<img lazy="loaded | loading | error" />
```



```laz
img[lazy=loaded] {
    ...
}
img[lazy=loading] {
    ...
}
img[lazy=error] {
    ...
}
```

