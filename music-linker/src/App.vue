<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './services/auth.js'
import MusicPlayer from './components/MusicPlayer.vue'
import Navigation from './components/Navigation.vue'

const { isAuthenticated, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push({ name: 'Home' }) // 登出后，跳转回首页
}
</script>

<template>
  <Navigation v-if="isAuthenticated"/>

  <main>
    <RouterView />
  </main>

  <MusicPlayer v-if="isAuthenticated"/>
</template>


<style scoped>
main {
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
