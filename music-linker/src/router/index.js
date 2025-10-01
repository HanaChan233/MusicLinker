// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

// 1. 定义路由组件。
// 我们将在下一步创建这些文件。
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';

import { useAuth } from '@/services/auth.js' // 👈 导入我们的鉴权服务

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: HomeView 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true } // ✨ 添加一个元字段，标记这个路由需要鉴权
  },
]

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

// 添加路由守卫
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated } = useAuth(); // 👈 获取鉴权服务
  const isLoggedIn = isAuthenticated.value;
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (!to.meta.requiresAuth && isLoggedIn && ['Home', 'Login'].includes(to.name)) {
    next('/dashboard');
  } else {
    next();
  }

})

export default router