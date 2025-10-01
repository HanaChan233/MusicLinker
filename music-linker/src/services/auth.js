import { ref, computed } from 'vue'

// 工具函数：设置cookie
function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/'
}

// 工具函数：获取cookie
function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, null)
}

// 工具函数：删除cookie
function deleteCookie(name) {
  setCookie(name, '', -1)
}

// 初始值为 null，代表未登录
const user = ref(null)

// 检查cookie中是否有用户信息，有则自动登录
const userCookie = getCookie('musiclinker_user')
if (userCookie) {
  try {
    user.value = JSON.parse(userCookie)
  } catch (e) {
    user.value = null
  }
}

// 这是一个 "Composable" 函数，遵循 `use` 开头的惯例
export function useAuth() {
  
  // 模拟登录
  const login = () => {
    // 在真实应用中，这里会发送请求到后端
    // 成功后，后端会返回用户信息
    const userInfo = { 
      username: 'HanaChan233',
      uid: 1,
      token: 'fake-jwt-token-string' 
    }
    user.value = userInfo
    setCookie('musiclinker_user', JSON.stringify(userInfo))
    return userInfo
  }

  // 模拟登出
  const logout = () => {
    user.value = null
    deleteCookie('musiclinker_user')
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