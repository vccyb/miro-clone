<!-- src/views/AuthCallback.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()

onMounted(async () => {
  try {
    // Step 1: 从 URL 中提取 Token（自动处理 Hash/History 模式）

    const params = new URLSearchParams(
      window.location.hash.split('#')[2] || window.location.search
    );

    const token = {
      access_token: params.get('access_token'),
      refresh_token: params.get('refresh_token'),
      expires_in: params.get('expires_in')
    };

    if (!token.access_token) {
      console.error('未找到 Token');
      return;
    }

    const { data, error } = await supabase.auth.setSession(
      token
    )

    if (error) throw error

    // Step 2: 会话已由 Supabase 自动处理，无需手动设置
    // Supabase 会自动将 Session 存储在本地（Cookie/LocalStorage）

    // Step 3: 跳转到首页（或其他页面）
    router.replace({ path: '/' })
  } catch (err) {
    console.error('OAuth 回调处理失败:', err.message)
    // 跳转到错误页面或登录页
    router.replace({ path: '/login', query: { error: 'oauth_failed' } })
  }
})
</script>

<template>
  <div class="auth-callback">
    <p>正在登录中，请稍候...</p>
  </div>
</template>
