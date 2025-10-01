import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 👈 导入我们的路由配置

import './assets/main.css'

const app = createApp(App)

app.use(router) // 👈 让应用使用路由

app.mount('#app')