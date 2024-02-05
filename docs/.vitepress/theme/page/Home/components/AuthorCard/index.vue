<template>
  <div class="author_card">
    <img class="avatar" :src="logo" alt="" />
    <ul class="tag_list">
      <li v-for="tag in autherInfo.tags" :key="tag.id" class="tag_item">
        <div>
          {{ tag.name }}
        </div>
        <div class="font-bold">{{ tag.value }}</div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { AutherInfo } from "../../../../types";

interface IProps {
  autherInfo: AutherInfo;
  logo: string;
}

defineProps<IProps>();
</script>
<style lang="less" scoped>
.author_card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 16px var(--shadow);
  box-sizing: border-box;
  .avatar {
    width: 6vw;
    height: 6vw;
    border-radius: 50%;
    &:hover {
      transform: rotate(666turn);
      transition-duration: 59s;
      transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
    }
  }
  .tag_list {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    gap: 2vw;
    .tag_item {
      text-align: center;
    }
  }
}
</style>
