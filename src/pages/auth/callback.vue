<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <n-spin size="large" />
        <p class="mt-4 text-gray-600">正在处理登录，请稍候...</p>
        <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-600 rounded">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabaseClient'
import { NSpin, useMessage } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const error = ref(false)
const errorMessage = ref('')

onMounted(async () => {
    try {
        console.log('OAuth 回调页面已加载', window.location.href)

        // 检查 URL 中是否有错误参数
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('error')) {
            throw new Error(urlParams.get('error_description') || '认证过程中出现错误')
        }

        // 等待 Supabase 处理认证信息
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 获取会话信息
        console.log('正在获取会话信息...')
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        console.log('会话信息:', data)

        if (data.session) {
            // 存储用户信息
            await authStore.setUser(data.session)

            message.success('登录成功')
            router.push('/')
        } else {
            throw new Error('未能获取会话信息，请重新登录')
        }
    } catch (err: any) {
        console.error('认证回调处理错误:', err)
        error.value = true
        errorMessage.value = err.message || '登录过程中出现错误'
        message.error(errorMessage.value)

        // 3秒后跳转到登录页
        setTimeout(() => {
            router.push('/login')
        }, 3000)
    }
})
</script>