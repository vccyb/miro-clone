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
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { NSpin, useMessage } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const error = ref(false)
const errorMessage = ref('')
const timeoutId = ref<number | null>(null)

// 监听用户状态变化
watch(() => authStore.user, (newUser) => {
    if (newUser) {
        // 用户已登录，跳转到首页
        if (timeoutId.value) {
            clearTimeout(timeoutId.value)
            timeoutId.value = null
        }
        message.success('登录成功')
        router.push('/')
    }
}, { immediate: true })

onMounted(async () => {
    try {
        console.log('OAuth 回调页面已加载', window.location.href)
        
        // 检查 URL 中是否有错误参数
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        // 检查URL参数中的错误
        if (urlParams.has('error') || hashParams.has('error')) {
            const errorDesc = urlParams.get('error_description') || hashParams.get('error_description') || '认证过程中出现错误'
            throw new Error(errorDesc)
        }
        
        // 设置超时处理（8秒后如果还没有登录成功就报错）
        timeoutId.value = setTimeout(() => {
            if (!authStore.user) {
                error.value = true
                errorMessage.value = '认证超时，请重新登录'
                message.error('认证超时，请重新登录')
                
                // 3秒后跳转到登录页
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            }
        }, 8000)
        
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