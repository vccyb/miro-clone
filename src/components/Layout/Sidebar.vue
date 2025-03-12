<template>
    <aside class="w-[220px] h-full bg-white border-r border-gray-200 flex flex-col">
        <!-- 顶部用户信息 -->
        <div class="p-4 border-b border-gray-200">
            <div class="flex items-center">
                <div
                    class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center text-sm font-medium text-green-600 cursor-pointer">
                    {{ userInitials }}
                </div>
                <div class="ml-3 flex-1 cursor-pointer">
                    <div class="flex-1">
                        <div class="text-sm font-medium">{{ username }}</div>
                        <div class="text-xs text-gray-500 cursor-pointer">{{ username }}</div>

                    </div>
                </div>

            </div>
        </div>

        <!-- 搜索框 -->
        <div class="px-4         py-3">
            <n-input placeholder="Search by title or topic" size="medium">
                <template #prefix>
                    <iconify-icon icon="material-symbols:search" />
                </template>
            </n-input>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 overflow-y-auto   ">
            <n-menu :options="menuOptions" />
        </nav>


    </aside>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { NInput, NButton, NMenu, NDropdown } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 用户信息
const username = computed(() => authStore.user?.email?.split('@')[0] || 'vccyb')
const userInitials = computed(() => {
    const name = username.value
    return name.substring(0, 2).toUpperCase()
})

// 用户菜单选项
const userMenuOptions = [
    {
        label: '个人设置',
        key: 'profile'
    },
    {
        label: '退出登录',
        key: 'logout'
    }
]

// 处理用户菜单选择
const handleUserMenuSelect = (key: string) => {
    if (key === 'logout') {
        // 处理登出逻辑
    }
}

// 导航菜单选项
const menuOptions = [
    {
        label: 'Explore',
        key: 'explore',
        icon: () => h('iconify-icon', { icon: 'material-symbols:explore-outline' })
    },
    {
        label: 'Home',
        key: 'home',
        icon: () => h('iconify-icon', { icon: 'material-symbols:home-outline' })
    },
    {
        label: 'Recent',
        key: 'recent',
        icon: () => h('iconify-icon', { icon: 'material-symbols:history' })
    },
    {
        label: 'Starred',
        key: 'starred',
        icon: () => h('iconify-icon', { icon: 'material-symbols:star-outline' })
    }
]
</script>