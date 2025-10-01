import { ref, computed } from 'vue'

// 使用 ref 创建一个响应式的 user 状态
// 初始值为 null，代表未登录
const user = ref(null)

// 这是一个 "Composable" 函数，遵循 `use` 开头的惯例
export function useAuth() {
  
  // 模拟登录
  const login = () => {
    // 在真实应用中，这里会发送请求到后端
    // 成功后，后端会返回用户信息
    return user.value = { 
      username: 'HanaChan233',
      uid: 1,
      // 假设还有一个 token
      token: 'fake-jwt-token-string' 
    }
  }

  // 模拟登出
  const logout = () => {
    user.value = null
  }

  // 一个计算属性，用于方便地判断是否已登录
  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}