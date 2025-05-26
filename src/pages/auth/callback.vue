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
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { NSpin, useMessage } from 'naive-ui'
import { supabase } from '../../lib/supabaseClient'

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

// 处理Hash模式下的OAuth回调
async function handleHashCallback() {
    try {
        console.log('开始处理Hash回调:', window.location.href)

        // 1. 解析 Hash 参数
        const tokenInfo = window.location.hash.split('#')[2]
        const hashParams = new URLSearchParams(tokenInfo)
        const access_token = hashParams.get('access_token')
        const refresh_token = hashParams.get('refresh_token')
        const error_param = hashParams.get('error')
        const error_description = hashParams.get('error_description')

        // 检查是否有错误
        if (error_param) {
            throw new Error(error_description || error_param)
        }

        // 检查是否有必要的token
        if (!access_token || !refresh_token) {
            console.log('未找到认证token，可能不是OAuth回调')
            return
        }

        console.log('找到认证token，开始设置会话...')

        // 2. 手动设置 Session
        const { data, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        })

        if (sessionError) {
            console.error('设置会话时出错:', sessionError)
            throw new Error(sessionError.message)
        }

        if (data.session) {
            console.log('会话设置成功:', data.session.user)
            // 更新认证store中的用户信息
            await authStore.getSession()
        }

        // 3. 清除 URL 中的 Hash
        window.history.replaceState({}, document.title, window.location.pathname)

    } catch (err: any) {
        console.error('处理Hash回调时出错:', err)
        throw err
    }
}

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

        // 处理Hash模式下的OAuth回调
        await handleHashCallback()

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

// 清理定时器
onUnmounted(() => {
    if (timeoutId.value) {
        clearTimeout(timeoutId.value)
        timeoutId.value = null
    }
})
</script>