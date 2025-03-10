import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.getSession() //  关键，保证时机
  const isPublicRoute = ['/login', '/register'].includes(to.path)
  if (!authStore.user && !isPublicRoute) {
    return {
      path: '/login',
    }
  }

  if (authStore.user && isPublicRoute) {
    return {
      name: '/'
    }
  }
})


if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
