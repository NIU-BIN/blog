<template>
  <Layout>
    <template #home-hero-before>
      <Home />
    </template>
    <template #doc-before> doc-before </template>
    <!-- <template #nav-bar-content-before> nav-bar-content-before </template> -->
    <template #layout-bottom> footer </template>
  </Layout>
</template>
<script setup>
import Theme from "vitepress/theme";
import Home from "../page/Home/index.vue";

const { Layout } = Theme;
</script>
<style lang="less" scoped>
.home_container {
  display: flex;
  width: 1050px;
  gap: 20px;
}
</style>
