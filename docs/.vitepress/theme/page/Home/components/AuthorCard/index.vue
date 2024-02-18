<template>
  <div class="author_card">
    <img class="avatar" :src="logo" alt="" />
    <div class="auther">{{ autherInfo.name }}</div>
    <ul class="tag_list">
      <li v-for="tag in autherInfo.tags" :key="tag.id" class="tag_item">
        <div class="tag_value">{{ tag.value }}</div>
        <div class="tag_label">
          {{ tag.name }}
        </div>
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
  .auther {
    margin: 16px 0 10px;
    font-size: 16px;
  }
  .tag_list {
    margin-top: 14px;
    display: flex;
    justify-content: center;
    gap: 2vw;
    .tag_item {
      text-align: center;
    }
    .tag_item:nth-child(2),
    .tag_item:nth-child(3) {
      .tag_value::before {
        content: "+";
      }
    }
    .tag_value {
      font-size: 18px;
    }
    .tag_label {
      font-size: 13px;
      color: #858585;
    }
  }
}
</style>
