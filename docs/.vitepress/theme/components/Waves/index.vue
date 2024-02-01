<template>
  <svg
    class="waves"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 24 150 28"
    preserveAspectRatio="none"
    shape-rendering="auto"
  >
    <!--形状容器-->
    <defs>
      <path
        id="gentle-wave"
        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
      ></path>
    </defs>
    <!--组合波浪-->
    <g class="parallax">
      <use class="use" xlink:href="#gentle-wave" x="48" y="0"></use>
      <use
        class="use dark:fill-black"
        xlink:href="#gentle-wave"
        x="48"
        y="3"
      ></use>
      <use
        class="use dark:fill-black"
        xlink:href="#gentle-wave"
        x="48"
        y="5"
      ></use>
      <use
        class="use dark:fill-black"
        xlink:href="#gentle-wave"
        x="48"
        y="7"
      ></use>
    </g>
  </svg>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@bg: rgba(255, 255, 255, 0.5);
.waves {
  margin-top: -11vh;
  position: relative;
  width: 100%;
  height: 12vh;
  min-height: 3.125rem;
  max-height: 9.375rem;
  z-index: 10;
}

.parallax {
  .use {
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;

    &:nth-child(1) {
      animation-delay: -2s;
      animation-duration: 7s;
      fill: var(--grey-1-a7);
      :is(.dark .dark\:fill-black) {
        fill: #000 !important;
      }
    }

    &:nth-child(2) {
      animation-delay: -3s;
      animation-duration: 10s;
      fill: var(--grey-1-a5);
      :is(.dark .dark\:fill-black) {
        fill: #000;
      }
    }

    &:nth-child(3) {
      animation-delay: -4s;
      animation-duration: 13s;
      fill: var(--grey-1-a3);
    }

    &:nth-child(4) {
      animation-delay: -5s;
      animation-duration: 20s;
      fill: var(--grey-1);
    }
  }
}

/* 波浪动画 */
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}

@media (max-width: 768px) {
  .waves {
    height: 10vh;
    min-height: 10vh;
  }
}
</style>
