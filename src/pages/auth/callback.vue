<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <n-spin size="large" />
        <p class="mt-4 text-gray-600">正在处理登录，请稍候...</p>
        <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-600 rounded">
            {{ errorMessage }}
            <div class="mt-2">
                <n-button size="small" @click="redirectToLogin">返回登录</n-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { NSpin, NButton, useMessage } from 'naive-ui'
import { supabase } from '../../lib/supabaseClient'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const error = ref(false)
const errorMessage = ref('')
const timeoutId = ref<number | null>(null)
const processed = ref(false)

// 监听认证状态变化
watch(() => authStore.user, (newUser) => {
    if (newUser && !processed.value) {
        processed.value = true
        clearTimeout(timeoutId.value!)
        message.success('登录成功！')
        router.push('/')
    }
})

// 处理OAuth回调
const handleOAuthCallback = async () => {
    try {
        console.log('开始处理OAuth回调:', window.location.href)
        
        // 检查URL中的错误参数
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        // 检查错误
        const urlError = urlParams.get('error') || hashParams.get('error')
        if (urlError) {
            const errorDesc = urlParams.get('error_description') || hashParams.get('error_description') || '认证失败'
            throw new Error(errorDesc)
        }
        
        // 让Supabase处理OAuth回调
        // 这会触发全局的onAuthStateChange监听器
        const { error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
            throw sessionError
        }
        
        console.log('OAuth回调处理完成，等待认证状态更新...')
        
    } catch (err: any) {
        console.error('OAuth回调处理失败:', err)
        error.value = true
        errorMessage.value = err.message || '认证过程中出现错误'
        message.error(errorMessage.value)
    }
}

const redirectToLogin = () => {
    router.push('/login')
}

onMounted(async () => {
    await handleOAuthCallback()
    
    // 设置超时（10秒）
    timeoutId.value = setTimeout(() => {
        if (!authStore.user && !error.value) {
            error.value = true
            errorMessage.value = '认证超时，请重新登录'
            message.error('认证超时，请重新登录')
        }
    }, 10000)
})

onUnmounted(() => {
    if (timeoutId.value) {
        clearTimeout(timeoutId.value)
    }
})
</script>