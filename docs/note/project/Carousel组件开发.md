---
category: project
cover: https://cdn.pixabay.com/photo/2023/12/16/00/06/mountain-8451604_640.jpg
---

# Carousel 组件开发

我们 Carousel 走马灯组件一般分为两部分，一个是走马灯的容器组件 `carousel`，一个是走马灯的每一项组件 `carousel-item`，所以我们需要创建两个组件。

然后我们思考一下大致思路，`carousel-item` 在我点击向右的时候向左移动一位，容器中出现下一个的 `carousel-item`，当到最后一个再点击下一位就变为了第一个，反之也是如此，这样我们就可以设置一个 `active` 来控制每一个 `carousel-item` 的位置。

创建如下的结构。

![](http://tuchuang.niubin.site/image/project-20250310-1.png)

carousel.js

```js
export const CarouselProps = {
  height: {
    type: String,
    default: "300px",
  },
};
```

carousel.vue

```html
<template>
  <div class="t-carousel" :style="{ height: props.height }">
    <div class="t-carousel__container">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
  import { CarouselProps } from "./carousel";

  defineOptions({
    name: "t-carousel",
  });

  const props = defineProps(CarouselProps);
</script>
```

carousel.less

```css
.t-carousel {
  position: relative;
  width: 500px;
  height: 200px;
  overflow: hidden;
  .t-carousel__container {
    width: 100%;
    height: 100%;
  }
}
```

carousel-item.vue

```html
<template>
  <div class="t-carousel-item"></div>
</template>
<script setup>
  defineOptions({
    name: "t-carousel-item",
  });
</script>
```

carousel-item.less

```css
.t-carousel-item {
  width: 100%;
  height: 100%;
  z-index: -1;
  position: absolute;
  &.is-active {
    z-index: 10;
  }
}
```

我们写一下示例

```html
<template>
  <t-carousel height="150px">
    <t-carousel-item>1</t-carousel-item>
    <t-carousel-item>2</t-carousel-item>
    <t-carousel-item>3</t-carousel-item>
    <t-carousel-item>4</t-carousel-item>
  </t-carousel>
</template>
<style>
  .t-carousel-item {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
  }

  .t-carousel-item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .t-carousel-item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>
```

## 基础样式和唯一处理

首先我们要知道 `active` 是哪一个，外部没有传递任何的唯一 id，我们该如何处理呢？其实类似于我们之前的 `Step` 组件，如果之前跟我们写过的人就知道了，我们可以通过 `vnode` 生成的 `uid` 来确认是哪个？这次我们换个简单思路，我们通过 `provide` 和 `inject` 来实现，先给 `carousel` 组件中定义一个数组来收集唯一的值，然后写一个 `push` 方法，将 `push` 方法和数组都 `provide` 出去，在 `carousel-item` 初始化的时候生成一个唯一的值，我们可以使用 symbol 来生成，然后调用 `push` 方法，将唯一的值传入，这样我们就得到了一个数组，每一个 `carousel-item` 都可以找到自己的位置。

carousel.vue

```js
import { provide } from "vue";
import { CarouselProps } from "./carousel";

defineOptions({
  name: "t-carousel",
});

const props = defineProps(CarouselProps);

const items = ref([]);

const activeIndex = ref(0);

const addItem = (item) => {
  items.value.push(item);
};

const removeItem = (uid) => {
  const index = items.value.findIndex((item) => item === uid);
  if (index > -1) {
    items.value.splice(index, 1);
  }
};

provide("carousel", {
  items,
  addItem,
  removeItem,
  activeIndex,
});
```

```html
<template>
  <div
    class="t-carousel-item"
    :class="{
      'is-active': currentIndex === activeIndex,
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
  import { ref, inject, computed, onMounted, onBeforeUnmount } from "vue";
  import { CarouselItemProps } from "./carousel-item";

  defineOptions({
    name: "t-carousel-item",
  });

  const props = defineProps(CarouselItemProps);

  const uid = ref(Symbol("carousel-item"));

  const carousel = inject("carousel");

  const { activeIndex, items, addItem, removeItem } = carousel;

  const currentIndex = computed(() => {
    return items.value.indexOf(uid.value);
  });

  onMounted(() => {
    addItem(uid.value);
  });

  onBeforeUnmount(() => {
    removeItem(uid.value);
  });
</script>
```

![](http://tuchuang.niubin.site/image/project-20250310-2.png)

这个 `is-active` 在第一个 `carousel-item` 的 `class` 上面加着，那说明我们没有问题。

## 切换功能实现

首先我们知道，每次切换到下一个都是右边的往左进入，前一个往左退出，并且有过渡效果，所以我们会想到先让所有的 `carousel-item` 摆成一排，先 `overflow: hidden`，只显示的当前 `active` 的，然后给 `carousel-item` 外面的盒子根据当前的 `active` 用 `translate` 来给设置位移，并且设置 `transition` 添加过渡效果，但是这样的话，我们在切换最后一个到第一个过渡的时候会返回去，体验很不好，所以一般我们会在最后面添加一个第一个 `carousel-item`，这样等到过渡到第一个（实际上是我们复制的第一个）的时候，取消过渡，然后将 `active` 设置到第一个，然后再过渡的时候添加上过渡效果，这样就可以无缝轮播了。

那有没有简单点的方案呢？

有的兄弟，有的。我们可以先把所有的`carousel-item`设置绝对定位，叠在一起，默认都是 `z-index:-1`; 然后 `active` 的设置为 10，每次轮播的时候下一个提前放在右侧，设置 `translate` 为 100%，设置 `display: none`， 然后当前设置 `translate` 为 0，当 `active` 的时候放开 `display`，然后让他从 `translate(100%)` 向 `translate(0)` 过渡，消失的时候从 `translate(0)` 向 `translate(-100%)` 过渡，等过渡结束又恢复到 `left:0; z-index: -1; display: none;` 这样就可以实现无缝轮播了。

那有没有更简单点的呢？

有的兄弟，有的，Vue 提供了 [Transition](https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component) 动画组件，可以将进入和离开动画应用到通过默认插槽传递给它的元素或组件，那就方便了很多了，我们可以直接设置进入和出来的样式即可。

carousel-item.vue

```html
<template>
  <Transition :name="transitionName" v-show="currentIndex === activeIndex">
    <div
      class="t-carousel-item"
      :class="{
        'is-active': currentIndex === activeIndex,
      }"
    >
      <slot></slot>
    </div>
  </Transition>
</template>

<script setup>
  import {
    ref,
    inject,
    computed,
    onMounted,
    onBeforeUnmount,
    nextTick,
  } from "vue";
  import { CarouselItemProps } from "./carousel-item";

  defineOptions({
    name: "t-carousel-item",
  });

  const props = defineProps(CarouselItemProps);

  const uid = ref(Symbol("carousel-item"));
  const transitionName = ref("carousel-next");

  const carousel = inject("carousel");

  const { activeIndex, items, addItem, removeItem } = carousel;

  const currentIndex = computed(() => {
    return items.value.indexOf(uid.value);
  });

  onMounted(() => {
    addItem(uid.value);
  });

  onBeforeUnmount(() => {
    removeItem(uid.value);
  });
</script>
```

carousel-item.less

```css
.t-carousel-item {
  width: 100%;
  height: 100%;
  z-index: -1;
  position: absolute;
  &.is-active {
    z-index: 10;
  }
}
.carousel-next-enter-active,
.carousel-next-leave-active {
  transition: all 0.35s linear;
}

.carousel-next-enter-active {
  transform: translateX(100%);
}
.carousel-next-enter-to,
.carousel-next-leave-active {
  transform: translateX(0);
}
.carousel-next-leave-to {
  transform: translateX(-100%);
}
```

我们写一个定时器，让他循环。

carousel.vue

```js
const play = (direction) => {
  if (direction === "prev") {
    activeIndex.value =
      activeIndex.value - 1 < 0
        ? items.value.length - 1
        : activeIndex.value - 1;
  } else {
    activeIndex.value =
      activeIndex.value + 1 > items.value.length - 1
        ? 0
        : activeIndex.value + 1;
  }
};

onMounted(() => {
  setInterval(() => {
    play("next");
  }, 2000);
});
```

这下无缝切换算是搞定了，但是我们发现刷新页面第一个 `carousel-item` 是从右边进来的，我们希望刚进入页面，第一个直接就在可视的位置内，然后过指定的时间从第二张才开始轮播，那我们处理一下添加动画的时机。

carousel-item.vue

```js
const transitionName = ref("");

onMounted(() => {
  addItem(uid.value);
  nextTick(() => {
    transitionName.value = "carousel-next";
  });
});
```

这时候我们将我们的轮播间隔、是否自动轮播抽成属性。

carousel.js

```js
export const CarouselProps = {
  height: {
    type: String,
    default: "300px",
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 3000,
  },
};
```

```js
let timer = null;

onMounted(() => {
  if (props.autoplay && props.interval > 0) {
    timer = setInterval(() => {
      play("next");
    }, props.interval);
  }
});

onUnmounted(() => {
  timer && clearInterval(timer);
});
```

## 主动切换

我们一般情况下需要主动切换，比如点击左右箭头，此时我们需要注意当我们鼠标移入轮播图范围的时候轮播图暂停，移出的时候继续轮播。我们先画一下左右的箭头。

carousel.vue

```html
<template>
  <div class="t-carousel" :style="{ height: props.height }">
    <div class="t-carousel__container">
      <slot></slot>
    </div>
    <button
      class="t-carousel__arrow t-carousel__arrow-left"
      @click="play('prev')"
    >
      <i class="t-icon icon-arrow-left-bold"></i>
    </button>
    <button
      class="t-carousel__arrow t-carousel__arrow-right"
      @click="play('next')"
    >
      <i class="t-icon icon-arrow-right-bold"></i>
    </button>
  </div>
</template>
```

carousel.less

```css
.t-carousel {
  position: relative;
  width: 500px;
  overflow: hidden;
  .t-carousel__container {
    width: 100%;
    height: 100%;
  }
  .t-carousel__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(31, 45, 61, 0.096);
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30;
    transition: all 0.3s;
    cursor: pointer;
    &-left {
      left: 10px;
    }
    &-right {
      right: 10px;
    }
    .t-icon {
      font-size: 12px;
    }
    &:hover {
      background-color: rgba(31, 45, 61, 0.23);
    }
  }
}
```

![](http://tuchuang.niubin.site/image/project-20250310-3.png)

接下来我们把鼠标移入暂停过渡，移除继续动画做一下。

```html
<template>
  <div
    class="t-carousel"
    :style="{ height: props.height }"
    @mouseenter="handleMouseEvent('enter')"
    @mouseleave="handleMouseEvent('leave')"
  >
    <div class="t-carousel__container">
      <slot></slot>
    </div>
    <button
      class="t-carousel__arrow t-carousel__arrow-left"
      @click="play('prev')"
    >
      <i class="t-icon icon-arrow-left-bold"></i>
    </button>
    <button
      class="t-carousel__arrow t-carousel__arrow-right"
      @click="play('next')"
    >
      <i class="t-icon icon-arrow-right-bold"></i>
    </button>
  </div>
</template>

<script setup>
  // ...

  let timer = null;

  const play = (direction) => {
    if (direction === "prev") {
      activeIndex.value =
        activeIndex.value - 1 < 0
          ? items.value.length - 1
          : activeIndex.value - 1;
    } else {
      activeIndex.value =
        activeIndex.value + 1 > items.value.length - 1
          ? 0
          : activeIndex.value + 1;
    }
  };

  const handleMouseEvent = (type) => {
    if (type === "enter") {
      timer && clearInterval(timer);
    } else {
      if (props.autoplay && props.interval > 0) {
        timer = setInterval(() => {
          play("next");
        }, props.interval);
      }
    }
  };

  onMounted(() => {
    if (props.autoplay && props.interval > 0) {
      timer = setInterval(() => {
        play("next");
      }, props.interval);
    }
  });

  // ...
</script>
```

我们不管是点向左还是向右，我们轮播都是从右往左切换，这时候我们完善一下反向切换的时候需要从左往右切换，那该怎么做呢？我们可以在点击向左的时候通过 `provide` 传递我们的方向，然后在 `carousel-item` 通过 `inject` 获取到方向，修改一下动画的名称，然后当我们鼠标移除轮播图的时候再重置一下轮播的方向即可。

carousel.vue

```js
// ...
const loopDirection = ref("next");

const play = (direction) => {
  loopDirection.value = direction;
  if (direction === "prev") {
    activeIndex.value =
      activeIndex.value - 1 < 0
        ? items.value.length - 1
        : activeIndex.value - 1;
  } else {
    activeIndex.value =
      activeIndex.value + 1 > items.value.length - 1
        ? 0
        : activeIndex.value + 1;
  }
};

const handleMouseEvent = (type) => {
  if (type === "enter") {
    timer && clearInterval(timer);
  } else {
    if (props.autoplay && props.interval > 0) {
      timer = setInterval(() => {
        play("next");
      }, props.interval);
    }
  }
};

provide("carousel", {
  items,
  addItem,
  removeItem,
  activeIndex,
  loopDirection,
});
```

carousel-item.vue

```js
const transitionName = ref("");

const carousel = inject("carousel");

const { activeIndex, items, addItem, removeItem, loopDirection } = carousel;

// ...

watch(
  () => loopDirection.value,
  (newVal) => {
    transitionName.value = `carousel-${newVal}`;
  }
);
```

这下我们点击左右切换都就可以了

## 指示器

我们一般情况下会在轮播图的下面加上一个指示器，这个可以显示当前有多少个轮播图，当前是第几个轮播图，鼠标点击或者 hover 某个指示器的时候可以快速跳转到对应的轮播图。

我们先来画一下指示器：

carousel.vue

```html
<template>
  <div
    class="t-carousel"
    :style="{ height: props.height }"
    @mouseenter="handleMouseEvent('enter')"
    @mouseleave="handleMouseEvent('leave')"
  >
    <!-- ... -->
    <ul class="t-carousel__indicators">
      <li
        v-for="(_, index) in items"
        :key="`indicators_${index}`"
        class="t-carousel__indicator"
      ></li>
    </ul>
  </div>
</template>
```

carousel.less

```css
.t-carousel__indicators {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0;
  margin: 0;
  z-index: 30;
  display: flex;
  .t-carousel__indicator {
    list-style: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(31, 45, 61, 0.096);
    margin: 0 4px;
    cursor: pointer;
    transition: all 0.3s;
  }
}
```

![](http://tuchuang.niubin.site/image/project-20250310-4.png)

目前是这个样子，我们添加一下对应 `active` 和 `hover` 的样式，顺便加一下点击事件

```html
<template>
  <div
    class="t-carousel"
    :style="{ height: props.height }"
    @mouseenter="handleMouseEvent('enter')"
    @mouseleave="handleMouseEvent('leave')"
  >
    <!-- ... -->
    <ul class="t-carousel__indicators">
      <li
        v-for="(_, index) in items"
        :key="`indicators_${index}`"
        :class="[
          't-carousel__indicator',
          { 'is-active': index === activeIndex },
        ]"
        @click="activeIndex = index"
      ></li>
    </ul>
  </div>
</template>
```

```css
.t-carousel__indicators {
  /* ... */
  display: flex;
  .t-carousel__indicator {
    /* ... */
    &.is-active {
      background-color: var(--t-primary);
    }
    &:hover {
      background-color: var(--t-primary);
    }
  }
}
```

这下指示器也没问题。

## 箭头显示

我们一般情况下可以控制指示器是否显示，以及我们的左右箭头是始终显示还是 hover 的时候再显示，还是始终不显示。我们定义一个 arrow 的属性，分别有三种状态，always、hover、never，默认是 hover。

```js
const CAROUSEL_ARROW = ["always", "hover", "never"];

export const CarouselProps = {
  height: {
    type: String,
    default: "300px",
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 3000,
  },
  arrow: {
    type: String,
    default: "hover",
    validator: (value) => CAROUSEL_ARROW.includes(value),
  },
};
```

```html
<template>
  <div
    class="t-carousel"
    :style="{ height: props.height }"
    @mouseenter="handleMouseEvent('enter')"
    @mouseleave="handleMouseEvent('leave')"
  >
    <div class="t-carousel__container">
      <slot></slot>
    </div>
    <button
      class="t-carousel__arrow t-carousel__arrow-left"
      @click="play('prev')"
      v-if="props.arrow !== 'never' && items.length > 1"
      :style="{
        left:
          props.arrow === 'always' || (props.arrow !== 'never' && isHovering)
            ? '10px'
            : '-50px',
      }"
    >
      <i class="t-icon icon-arrow-left-bold"></i>
    </button>
    <button
      class="t-carousel__arrow t-carousel__arrow-right"
      @click="play('next')"
      v-if="props.arrow !== 'never'"
      :style="{
        right:
          props.arrow === 'always' || (props.arrow !== 'never' && isHovering)
            ? '10px'
            : '-50px',
      }"
    >
      <i class="t-icon icon-arrow-right-bold"></i>
    </button>
    <ul class="t-carousel__indicators">
      <li
        v-for="(_, index) in items"
        :key="`indicators_${index}`"
        :class="[
          't-carousel__indicator',
          { 'is-active': index === activeIndex },
        ]"
        @click="activeIndex = index"
      ></li>
    </ul>
  </div>
</template>

<script setup>
  import { ref, provide, onMounted, onUnmounted } from "vue";
  import { CarouselProps } from "./carousel";

  defineOptions({
    name: "t-carousel",
  });

  const props = defineProps(CarouselProps);

  const items = ref([]);
  const activeIndex = ref(0);
  const loopDirection = ref("next");
  const isHovering = ref(false);
  let timer = null;

  const addItem = (item) => {
    items.value.push(item);
  };

  const removeItem = (uid) => {
    const index = items.value.findIndex((item) => item === uid);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  };

  const play = (direction) => {
    loopDirection.value = direction;
    if (direction === "prev") {
      activeIndex.value =
        activeIndex.value - 1 < 0
          ? items.value.length - 1
          : activeIndex.value - 1;
    } else {
      activeIndex.value =
        activeIndex.value + 1 > items.value.length - 1
          ? 0
          : activeIndex.value + 1;
    }
  };

  const handleMouseEvent = (type) => {
    if (type === "enter") {
      isHovering.value = true;
      timer && clearInterval(timer);
    } else {
      isHovering.value = false;
      if (props.autoplay && props.interval > 0) {
        timer = setInterval(() => {
          play("next");
        }, props.interval);
      }
    }
  };

  onMounted(() => {
    if (props.autoplay && props.interval > 0) {
      timer = setInterval(() => {
        play("next");
      }, props.interval);
    }
  });

  onUnmounted(() => {
    timer && clearInterval(timer);
  });

  provide("carousel", {
    items,
    addItem,
    removeItem,
    activeIndex,
    loopDirection,
  });
</script>
```

![](http://tuchuang.niubin.site/image/project-20250310-5.png)
