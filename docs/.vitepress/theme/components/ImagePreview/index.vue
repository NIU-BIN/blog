<template>
  <ElImageViewer
    v-if="showPreview"
    :infinite="false"
    hide-on-click-modal
    teleported
    :url-list="previewList"
    :initial-index="initialIndex"
    @close="showPreview = false"
  />
</template>
<script setup lang="ts">
import { ElImageViewer } from "element-plus";
import { useRoute } from "vitepress";
import { ref, watch, nextTick, onMounted } from "vue";

const route = useRoute();

const previewList = ref<string[]>([]);
const showPreview = ref(false);
const initialIndex = ref(0);

// 不需要获取图片的页面（主页、归档、关于）
const IGNORE_PATH = ["/", "/archive.html"];

const getCurrentPageImages = () => {
  const allImageElement = document
    .querySelector(".VPDoc")!
    .querySelectorAll(".container img");

  const imageList = Array.from(allImageElement)
    .map((item: Element) => {
      return item.getAttribute("src");
    })
    .filter((item) => item !== null);
  previewList.value = imageList as string[];
};

const previewImage = (e: Event) => {
  if ((e.target as HTMLElement).tagName.toLowerCase() === "img") {
    const imageSrc = (e.target as HTMLImageElement).getAttribute("src");
    initialIndex.value =
      previewList.value.findIndex((v) => imageSrc === v) || 0;
    showPreview.value = true;
  }
};

onMounted(() => {
  const container = document.querySelector(".VPDoc .container");
  container?.addEventListener("click", previewImage);
});

watch(
  () => route.path,
  (newValue) => {
    !IGNORE_PATH.includes(newValue) && nextTick(() => getCurrentPageImages());
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less" scoped></style>
