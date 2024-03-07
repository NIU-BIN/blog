<template>
  <div
    class="back_to_top"
    ref="toTop"
    :style="{
      top: top + 'px',
    }"
    @click="topTop"
  ></div>
</template>
<script setup lang="ts">
import { useRoute } from "vitepress";
import { nextTick, onUnmounted, ref, watch } from "vue";

const route = useRoute();
const toTop = ref();
const top = ref<number>(-900);
const offsetHeight = ref<number>(0);

const topTop = () => {
  top.value = -900;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

let timer: NodeJS.Timeout | null = null;

const backToTop = () => {
  if (!timer) {
    timer = setTimeout(() => {
      offsetHeight.value = document.querySelector("html")!.offsetHeight;
      const scrollTop = document.querySelector("html")!.scrollTop;
      if (scrollTop < 800) {
        top.value = -900;
      } else {
        top.value = (900 - (scrollTop / offsetHeight.value) * 900) * -1;
      }
      timer = null;
    }, 100);
  }
};

window.addEventListener("scroll", backToTop);

onUnmounted(() => {
  window.removeEventListener("scroll", backToTop);
});

watch(
  () => route.path,
  () => {
    nextTick(() => {
      offsetHeight.value = document.querySelector("html")!.offsetHeight;
    });
  }
);
</script>
<style lang="less" scoped>
@keyframes float {
  0% {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
  50% {
    -webkit-transform: translateY(-10px);
    -ms-transform: translateY(-10px);
    transform: translateY(-10px);
  }
  100% {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
}

.back_to_top {
  cursor: pointer;
  position: fixed;
  right: 80px;
  top: -900px;
  z-index: 1000;
  width: 70px;
  height: 900px;
  background: url("../../styles/scroll.gif");
  transition: all 0.5s ease-in-out;
  opacity: 1;
  &:hover {
    animation: float 2s linear infinite;
  }
}
</style>
