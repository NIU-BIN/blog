<template>
  <div class="friendly_link">
    <div class="section_top">🤝 &nbsp; 友情链接</div>
    <ul class="friend_list">
      <li class="friend_item" v-for="item in friend" :key="item.link">
        <img :src="item.avatar" alt="" class="avatar" />
        <div class="friend_info">
          <div class="friend_name">{{ item.name }}</div>
          <div class="friend_desc">{{ item.desc }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
const friend = [
  {
    avatar:
      "https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030",
    name: "粥里有勺糖",
    desc: "你的指尖,拥有改变世界的力量",
    link: "https://sugarat.top/",
  },
  {
    avatar: "https://vitepress.dev/vitepress-logo-large.webp",
    name: "Vitepress",
    desc: "Vite & Vue Powered Static Site Generator",
    link: "https://vitepress.dev/zh/",
  },
];
</script>
<style lang="less" scoped>
.friendly_link {
  margin-top: 20px;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 16px var(--shadow);
  box-sizing: border-box;
  .section_top {
    font-weight: bold;
    margin-bottom: 20px;
  }
}
.friend_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.friend_item {
  display: flex;
  gap: 20px;

  flex-shrink: 0;
  .avatar {
    width: 3vw;
    height: 3vw;
    border-radius: 50%;
  }
  .friend_info {
    flex-shrink: 0;
    // flex: 1;
    .friend_name {
      width: 100%;
      font-size: 14px;
    }
    .friend_desc {
      font-size: 13px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
