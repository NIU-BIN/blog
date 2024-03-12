<script setup>
import { onMounted } from "vue";

onMounted(() => {
  import("../../assets/L2Dwidget.min.js").then((module) => {
    const L2Dwidget = module.default;
    L2Dwidget.init({
      // model: {
      //   jsonPath:
      //     // "https://cdn.jsdelivr.net/gh/wangsrGit119/wangsr-image-bucket/L2Dwidget/live2d-widget-model-haruto/assets/haruto.model.json",
      //     // "https://unpkg.com/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json",
      //     // "https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",
      //     // "https://unpkg.com/live2d-widget-model-nito@1.0.5/assets/nito.model.json",
      //     "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json",
      // },
      display: {
        superSample: 2,
        width: 180,
        height: 320,
        position: "left",
        hOffset: 0,
        vOffset: 0,
      },
      // dialog: {
      //   // 开启对话框
      //   enable: true,
      //   script: {
      //     // 每空闲 10 秒钟，显示一条一言
      //     "every idle 10s": "$hitokoto$",
      //     // 当触摸到星星图案
      //     "hover .star": "星星在天上而你在我心里 (*/ω＼*)",
      //     // 当触摸到角色身体
      //     "tap body": "哎呀！别碰我！",
      //     // 当触摸到角色头部
      //     "tap face": "人家已经不是小孩子了！",
      //   },
      // },
    });
  });
});
</script>
