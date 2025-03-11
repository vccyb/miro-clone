<template>
    <n-message-provider>
        <RootLayout>
            <RouterView></RouterView>
        </RootLayout>
    </n-message-provider>
</template>

<script setup lang="ts">
import RootLayout from '@/components/Layout/RootLayout.vue'
import { supabase } from '@/lib/supabaseClient'
import { NMessageProvider } from 'naive-ui'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

onMounted(() => {
    const authStore = useAuthStore()
    // 初始化获取会话
    authStore.getSession()
    // 启动认证状态监听
    authStore.trackAuthChanges()
})
</script>

<style scoped></style>
