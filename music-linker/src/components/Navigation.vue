<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const search = () => {console.log(searchInput.value.value)};

const searchInput = ref(null);

</script>

<template>
  <nav>
    <div style="width: 60%;">
      <div style="position: relative; width: 100%;">
        <input class="search-keyword" name="searchKeyword" placeholder="搜索音乐、歌手、专辑..." ref="searchInput" @keydown.enter="search()" style="padding-right: 40px;"/>
        <img src="@/assets/icon-navigator-search.svg" alt="搜索" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; cursor: pointer;" @click="search()"/>
      </div>
    </div>
    <div style="gap: 20px; font-size: 24px; width: calc(3 * 5em + 2 * 20px + 3px * 2 * 3)">
      <RouterLink class="navigator-buttons" to="/space/playlist">播放列表</RouterLink>
      <RouterLink class="navigator-buttons" to="/space/favorite">收藏歌曲</RouterLink>
      <RouterLink class="navigator-buttons" to="/import">导入歌曲</RouterLink>
    </div>
    <div style="width: calc(72px + 1em + 200px + 3.5em); justify-content: space-between;">
      <div style="width: calc(72px + 1em + 200px); justify-content: left;">
        <RouterLink to="/space" style="min-width: 48px; height: 48px; aspect-ratio: 1; margin-right: 1em; padding: 0;">
          <img src="https://picsum.photos/300" style="border-radius: 50%;"/>
        </RouterLink>
        <p style="font-size: 24px; text-decoration: none;">花花花花花花花花</p>
      </div>
      <a style="min-width: 3.5em; font-size: 18px; translate: 0px 2px;" href="#" @click.prevent="handleLogout">登出</a>
    </div>
  </nav>
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
  box-shadow: 0px 5px 10px #0c0c0c;
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

a.navigator-buttons {
  border-bottom: 2px solid var(--color-background);
  transition: 0.3s all;
}

a.navigator-buttons:hover {
  border-bottom: 2px solid var(--color-text);
}
</style>