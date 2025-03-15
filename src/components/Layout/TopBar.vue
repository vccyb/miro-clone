<template>
    <header class="h-16 border-b border-gray-200 bg-white flex items-center px-4">
        <!-- 左侧 Logo 和标题 -->
        <div class="flex items-center">
            <h1 class="text-xl font-bold">VBorad</h1>
            <span class="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">FREE</span>
        </div>

        <!-- 右侧操作区 -->
        <div class="ml-auto flex items-center space-x-4">
            <!-- 用户头像和下拉菜单 -->
            <n-dropdown :options="dropdownOptions" @select="handleSelect" trigger="click">
                <div v-if="avatarUrl" class="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
                    <img :src="avatarUrl" alt="用户头像" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                    <span class="text-sm font-medium">{{ userInitials }}</span>
                </div>
            </n-dropdown>
        </div>
    </header>
</template>

<script setup lang="ts">
import { NButton, NDropdown } from 'naive-ui'
import { computed, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { logoutFn } from '@/service/auth'
const router = useRouter()
const authStore = useAuthStore()

// 获取用户头像URL
const avatarUrl = computed(() => {
    return authStore.user?.user_metadata?.avatar_url || null
})

// 用户名首字母
const username = computed(() => authStore.user?.email?.split('@')[0] || 'user')
const userInitials = computed(() => {
    const name = username.value
    return name.substring(0, 2).toUpperCase()
})

// 下拉菜单选项
const dropdownOptions = [
    {
        label: '个人中心',
        key: 'profile',
        icon: () => h('iconify-icon', { icon: 'mdi:account' })
    },
    {
        label: '注销',
        key: 'logout',
        icon: () => h('iconify-icon', { icon: 'mdi:logout' })
    }
]

// 处理菜单选择
const handleSelect = async (key: string) => {
    if (key === 'logout') {
        await logoutFn()
        router.push('/login')
    } else if (key === 'profile') {
        router.push('/profile')
    }
}
</script>