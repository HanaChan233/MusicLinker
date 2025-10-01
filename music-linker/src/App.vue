<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './services/auth.js'
import MusicPlayer from './components/MusicPlayer.vue'

const { isAuthenticated, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push({ name: 'Home' }) // 登出后，跳转回首页
}
</script>

<template>
  <!--
  <header>
    <div class="wrapper">
      <nav>
        <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <!--👇用于让后续右上角的导航栏适配 flex 的 space-between 属性--><!--
        <div v-if="router.currentRoute.value.name == 'Home'"></div>
        <!--👇在首页的时候不显示，因为首页本身有一个巨大的 Logo 展示在左边--><!--
        <RouterLink v-if="router.currentRoute.value.name !== 'Home'" to="/">
          <img src="@/assets/logo.png" class="logo"/>
        </RouterLink>
        <div style="display: flex; flex-direction: row-reverse;">
          <RouterLink v-if="isAuthenticated" to="/dashboard">Dashboard</RouterLink>
          <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
          <a v-if="isAuthenticated" href="#" @click.prevent="handleLogout">Logout</a>
        </div>
      </div>

      </nav>
    </div>
  </header>
  -->

  <main>
    <RouterView />
  </main>

  <MusicPlayer v-if="isAuthenticated"/>
</template>


<style scoped>
/* 添加一些简单的样式让导航更好看 */

header {
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  height: 50px;
}
nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 1rem;
}
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
nav a:first-of-type {
  border: 0;
}
main {
  padding-top: 2rem;
  text-align: center;
  flex: 1;
}

.warpper
{
  height: 50px;
}

.logo
{
  height: 100px;
  width: 100px;
}
</style>
