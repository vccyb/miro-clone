<template>
  <n-message-provider>
    <!-- 根据路由选择不同的布局 -->
    <AuthLayout v-if="isAuthRoute">
      <RouterView></RouterView>
    </AuthLayout>
    <RootLayout v-else>
      <RouterView></RouterView>
    </RootLayout>
  </n-message-provider>
</template>

<script setup lang="ts">
import RootLayout from '@/components/Layout/RootLayout.vue'
import AuthLayout from '@/components/Layout/AuthLayout.vue'
import { NMessageProvider } from 'naive-ui'
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const route = useRoute()

// 判断当前是否为认证相关路由
const isAuthRoute = computed(() => {
  const authRoutes = ['/login', '/register', '/auth/callback']
  return authRoutes.includes(route.path)
})

onMounted(() => {
  const authStore = useAuthStore()
  // 初始化获取会话
  authStore.getSession()
  // 启动认证状态监听
  authStore.trackAuthChanges()
})
</script>

<style scoped></style>
