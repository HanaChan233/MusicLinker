<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div>
    <div style="flex-direction: column;">
      <div>
        <h1>我的歌单</h1>
        
      </div>
      <div>
        <h1>上次播放</h1>
        
      </div>
    </div>
    <div>
      <h1>猜你喜欢</h1>
    </div>
  </div>
</template>

<style scoped>
div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

nav {
  height: 100px;
  width: 100%;
  padding: 14px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap:30px;
}

button {
  background-color: transparent;
  border: none;
  padding: 0;
}

img {
  width: 100%;
  height: 100%;
}

input {
  padding: 10px;
  border: none;
  border-bottom: 2px solid var(--color-border);
  font-size: 20px;
  width: 100%;
  background-color: transparent;
  color: var(--color-text);
  transition: 0.3s all;
}

input:focus {
  outline: none;
  border-bottom: 2px solid var(--color-text);
}

a {
  font-size: 24px;
}
</style>