import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

// 添加重定向路由
const routesWithRedirect = [
  {
    path: '/home',
    redirect: '/'
  },
  ...routes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routesWithRedirect,
})


router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // 公开路由，包括登录、注册和认证回调
  const isPublicRoute = ['/login', '/register', '/auth/callback'].includes(to.path)

  // 如果是认证回调页面，直接允许访问
  if (to.path === '/auth/callback') {
    return true
  }

  // 获取会话信息
  await authStore.getSession()

  // 未登录且访问非公开路由，重定向到登录页
  if (!authStore.user && !isPublicRoute) {
    return { path: '/login' }
  }

  // 已登录且访问公开路由，重定向到首页
  if (authStore.user && isPublicRoute) {
    return { path: '/' }
  }
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
