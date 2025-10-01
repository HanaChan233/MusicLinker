<script setup>
import { ref } from 'vue'
import { useAuth } from '../services/auth.js'
import { RouterLink, useRouter } from 'vue-router'

const { login } = useAuth()
const router = useRouter()

const username = ref('');
const password = ref('');

const passwordInput = ref(null);

const handleLogin = () => {
  login() // 调用模拟的登录方法
  router.push({ name: 'Dashboard' }) // 登录成功后，跳转到 'Dashboard' 页面
}
</script>

<template>
  <div>
    <div style="width: 400px; height: 500px; background-color: var(--color-background-secondary); border-radius: 20px; gap: 30px;">
      <h1>登录</h1>
      <input
        v-model="username"
        type="text"
        placeholder="用户名"
        @keydown.enter="() => passwordInput.focus()"
      />
      <input
        v-model="password"
        type="password"
        placeholder="密码"
        ref="passwordInput"
        @keydown.enter="handleLogin()"
      />
      <button @click="handleLogin">
        <p style="font-size: 22px; translate: 0px -1px;">登录</p>
      </button>
      <RouterLink to="/register">没有账号？注册账号→</RouterLink>
    </div>
  </div>
</template>

<style scoped>
div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  color: var(--color-text-secondary);
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 30px;
}

input {
  padding: 10px;
  border: none;
  border-bottom: 2px solid var(--color-border);
  font-size: 16px;
  width: 70%;
}
input:focus
{
  outline: none;
}

button {
    width: 120px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: 2px solid var(--color-border-secondary);
    margin-top: 30px;
    border-radius: 25px;
    color: var(--color-text-secondary);
    
    transition: 0.3s all;
}
button:hover {
    background-color: var(--color-border-secondary);
    color: var(--color-text-secondary);
}
</style>