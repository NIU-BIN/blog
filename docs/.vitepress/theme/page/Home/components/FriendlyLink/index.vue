<template>
  <div class="friendly_link">
    <div class="section_top">🤝 &nbsp; 友情链接</div>
    <ul class="friend_list">
      <li class="friend_item" v-for="item in friends" :key="item.link">
        <img :src="item.avatar" alt="" class="avatar" />
        <div class="friend_info">
          <div class="friend_name" @click="linkTo(item)">{{ item.name }}</div>
          <div class="friend_desc">{{ item.desc }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { FriendItem } from "../../../../types";
interface IProps {
  friends: FriendItem[];
}

defineProps<IProps>();

const linkTo = (item: FriendItem) => {
  window.open(item.link);
};
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
  cursor: pointer;
  &:hover {
    .friend_name {
      color: #5d67e8;
      text-decoration: underline;
    }
  }
  .avatar {
    width: 3vw;
    height: 3vw;
    border-radius: 50%;
  }
  .friend_info {
    min-width: 0;
    flex: 1;
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
