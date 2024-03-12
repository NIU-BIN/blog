<template>
  <Layout>
    <template #home-hero-before>
      <Home />
    </template>
    <template #layout-bottom>
      <Footer v-if="layout === 'home'" />
      <ClientOnly>
        <BoardPets />
      </ClientOnly>
    </template>

    <template #sidebar-nav-after>
      <Sidebar />
    </template>
    <!-- <template #doc-before>
      <ClientOnly>
        <DocMeta :category="frontmatter.category" />
      </ClientOnly>
    </template> -->
    <template #doc-after>
      <Comment />
      <ClientOnly>
        <ImagePreview />
        <BackToTop />
      </ClientOnly>
    </template>
  </Layout>
</template>
<script setup>
import Theme from "vitepress/theme";
import Home from "../page/Home/index.vue";
import Sidebar from "../components/Sidebar/index.vue";
import Footer from "../components/Footer/index.vue";
import Comment from "../components/Comment/index.vue";
import ImagePreview from "../components/ImagePreview/index.vue";
import BackToTop from "../components/BackToTop/index.vue";
import DocMeta from "../components/DocMeta/index.vue";
import BoardPets from "../components/BoardPets/index.vue";
import { useData } from "vitepress";
import { computed } from "vue";

const { Layout } = Theme;
const { frontmatter } = useData();

const layout = computed(() => frontmatter.value.layout);
</script>
<style lang="less" scoped>
.home_container {
  display: flex;
  width: 1050px;
  gap: 20px;
}
</style>
