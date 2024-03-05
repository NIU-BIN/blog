<template>
  <div ref="docMeta" v-show="!IGNORE_PATH.includes(route.path)">
    <div class="doc_meta">
      <div class="meta_item" title="分类">
        <svg
          t="1709544282628"
          class="icon"
          viewBox="0 0 1069 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2651"
          width="16"
          height="16"
        >
          <path
            d="M0.002763 173.176631C1.156583 255.164091 102.72775 327.209617 155.654932 337.035326 155.654932 294.769922 155.423157 277.59307 155.383198 277.59307 155.343238 277.59307 58.445402 250.790106 58.01328 176.159267 57.620441 108.133618 69.389894 46.251969 159.102507 46.251969 237.670283 46.251969 264.366025 95.987421 288.07778 156.000856L351.434835 155.98913C318.605288 71.99768 274.333935 0 152.553883 0 33.394067 0-0.352144 91.189169 0.002763 173.176631Z"
            fill="#8a8a8a"
            p-id="2652"
          ></path>
          <path
            d="M537.799182 155.826087 289.394067 155.826087 345.402415 305.413864 333.915807 333.405801C333.915804 350.184548 336.704962 355.073955 333.915807 363.129159 341.39153 389.585099 365.28399 405.101434 391.136717 405.101434 421.463878 405.101434 447.348031 383.015083 447.32839 348.883053 447.316605 333.38626 430.110262 301.372581 403.7822 296.061068L383.71599 243.17655C461.592369 254.690687 496.716093 302.771785 495.682928 350.18455 494.327633 412.328061 456.355827 455.969222 390.264614 455.660457 332.053749 455.386871 289.64564 419.755435 289.39407 356.173913 289.32462 338.621471 288.12258 325.553831 295.064042 304.174901 300.74842 285.348152 266.748216 203.963603 266.748216 203.963603L247.825168 155.826087 200.212002 155.826087 200.212002 482.546321C199.214192 509.881649 237.91777 543.345343 237.91777 543.345343L716.159816 1017.965434 1065.055736 664.959023C1065.051807 664.966841 639.733015 241.359144 592.678772 194.270779 559.354251 160.936061 537.799182 155.826087 537.799182 155.826087Z"
            fill="#8a8a8a"
            p-id="2653"
          ></path>
          <path
            d="M155.82885 489.73913 155.82885 378.434783 89.046241 378.434783 89.046241 575.567934C89.046241 616.961768 133.371561 645.354505 133.371561 645.354505L509.047305 1021.901192 569.94126 960.441649C569.94126 960.43774 245.106722 634.883909 196.092216 586.861434 147.907654 541.432066 155.82885 489.73913 155.82885 489.73913Z"
            fill="#8a8a8a"
            p-id="2654"
          ></path>
        </svg>
        <span>{{ props.category || "" }}</span>
      </div>
      <div class="meta_item" title="更新时间">
        <svg
          t="1709544400178"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4135"
          width="16"
          height="16"
        >
          <path
            d="M512 64C264.8 64 64 264.8 64 512s200.8 448 448 448 448-200.8 448-448S759.2 64 512 64z m0 832c-212 0-384-172-384-384s172-384 384-384 384 172 384 384-172 384-384 384z m32-393.6l191.2 110.4-32 55.2L488.8 544H480V256h64v246.4z"
            p-id="4136"
            fill="#8a8a8a"
          ></path>
        </svg>
        <span>{{ articleInfo.updateTime }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vitepress";
import { ref, watch, nextTick } from "vue";
import { useConfig } from "../../utils/client";
import { ArticleItem } from "../../types";

interface IProps {
  category: string | undefined;
}

const props = defineProps<IProps>();

const { article } = useConfig();
const route = useRoute();
const docMeta = ref();
const articleInfo = ref<ArticleItem>({} as ArticleItem);

const setMetaDOM = () => {
  const docTitle = document.querySelector(".vp-doc h1");
  const docMetaDOM = document.querySelector(".vp-doc .doc_meta");
  if (!docMetaDOM) {
    docTitle?.insertAdjacentHTML("afterend", docMeta.value.getInnerHTML());
    docMeta.value.remove();
  }
};

// 不是文章的页面
const IGNORE_PATH = ["/about.html", "/archive.html", "/"];

watch(
  () => route.path,
  (newValue) => {
    if (!IGNORE_PATH.includes(newValue)) {
      const currentPageInfo = article.find(
        (item) =>
          decodeURIComponent(item.path) + ".html" ===
          decodeURIComponent(newValue)
      );
      articleInfo.value = currentPageInfo;
      nextTick(() => {
        setMetaDOM();
      });
    }
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less" scoped>
.doc_meta {
  margin: 20px 0 30px;
  font-size: 14px;
  color: #919191;
  display: flex;
  gap: 20px;
  .meta_item {
    display: flex;
    align-items: center;
    gap: 6px;
    svg {
      width: 16px;
    }
  }
}
</style>
