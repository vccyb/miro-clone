<template>
    <div class="container mx-auto py-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
            <h1 class="text-2xl font-bold mb-6">个人中心</h1>

            <div class="flex items-start">
                <!-- 用户头像 -->
                <div class="mr-6">
                    <div v-if="avatarUrl" class="w-24 h-24 rounded-full overflow-hidden">
                        <img :src="avatarUrl" alt="用户头像" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-2xl font-medium">{{ userInitials }}</span>
                    </div>
                </div>

                <!-- 用户信息 -->
                <div class="flex-1">
                    <div class="mb-4">
                        <h2 class="text-lg font-medium">{{ username }}</h2>
                        <p class="text-gray-500">{{ email }}</p>
                    </div>

                    <div class="border-t pt-4 mt-4">
                        <h3 class="text-md font-medium mb-2">账户信息</h3>
                        <p class="text-gray-600 mb-1">账户创建时间: {{ createdAt }}</p>
                        <p class="text-gray-600">上次登录时间: {{ lastSignIn }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// 用户信息
const avatarUrl = computed(() => authStore.user?.user_metadata?.avatar_url || null)
const email = computed(() => authStore.user?.email || '未设置邮箱')
const username = computed(() => authStore.user?.email?.split('@')[0] || '用户')
const userInitials = computed(() => {
    const name = username.value
    return name.substring(0, 2).toUpperCase()
})

// 格式化日期
const formatDate = (dateString: string) => {
    if (!dateString) return '未知'
    return new Date(dateString).toLocaleString('zh-CN')
}

// 账户信息
const createdAt = computed(() => formatDate(authStore.user?.created_at || ''))
const lastSignIn = computed(() => formatDate(authStore.user?.last_sign_in_at || ''))
</script>