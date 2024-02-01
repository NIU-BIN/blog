<template>
  <Layout>
    <template #home-hero-before>
      <div class="home">
        <div class="swiper">
          <div class="swiper_mask"></div>
          <div class="swiper_content">
            <h1 class="title">
              {{ title }}
            </h1>
            <h3 class="description">
              {{ description }}
            </h3>
          </div>
        </div>
        <Waves />
        <div class="aaa"></div>
      </div>
    </template>
    <template #doc-before> doc-before </template>
    <!-- <template #nav-bar-content-before> nav-bar-content-before </template> -->
    <template #layout-bottom> footer </template>
  </Layout>
</template>
<script setup>
import Theme from "vitepress/theme";
import Waves from "../components/Waves/index.vue";
import { useData } from "vitepress";

const { Layout } = Theme;

const { title, description } = useData();
</script>
<style lang="less" scoped>
.swiper {
  position: relative;

  .swiper_mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .swiper_content {
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    .title {
      display: inline-block;
      line-height: normal;
      font-size: 52px;
      font-weight: bold;
      color: #fff;
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
      // // margin-bottom: 1.5rem !important;
      // background-image: linear-gradient(
      //   to right,
      //   var(--tw-gradient-stops)
      // ) !important;
      // --tw-gradient-from: #5d67e8 !important;
      // --tw-gradient-to: rgb(93 103 232 / 0) !important;
      // --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
      // --tw-gradient-to: #ef4444 !important;
      // text-align: left !important;
    }
    .description {
      margin-top: 20px;
      font-size: 20px;
      color: #fff;
    }
  }
}

.aaa {
  height: 50vh;
}
</style>
