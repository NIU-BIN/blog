<template>
  <footer class="page_footer">
    <div class="author">Copyright ©2023 by <a href="">@友人A</a></div>
    <div class="badge">
      <img src="https://img.shields.io/badge/-vite-ffffff?logo=vite" alt="" />
      <img src="https://img.shields.io/badge/-Vue3-34495e?logo=vue.js" alt="" />
      <img
        src="https://img.shields.io/badge/-TypeScript-ffffff?logo=TypeScript"
        alt=""
      />
      <!-- 34495e -->
    </div>
  </footer>
</template>
<script setup></script>
<style lang="less" scoped>
.page_footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 80px;
  background-color: var(--vp-c-bg);
  .author {
    font-size: 0.875rem;
  }
  .badge {
    display: flex;
    gap: 1rem;
  }
}
</style>
