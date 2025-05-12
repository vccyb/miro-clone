<template>
    <div class="absolute top-2 right-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
        <div class="flex items-center gap-2">
            <!-- 当前用户头像 -->
            <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                    <n-avatar v-if="user" :src="user.user_metadata?.avatar_url" :fallback="getInitials(user.email)"
                        round>
                        {{ getInitials(user.email) }}
                    </n-avatar>
                </template>
                {{ user?.email || '当前用户' }}
            </n-tooltip>

            <!-- 邀请按钮 -->
            <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                    <n-button quaternary :focusable="false">
                        <iconify-icon icon="material-symbols:add"></iconify-icon>
                        <span class="ml-1">邀请</span>
                    </n-button>
                </template>
                邀请其他用户协作
            </n-tooltip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NButton, NAvatar, NTooltip } from 'naive-ui';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// 获取用户名首字母作为头像备用显示
const getInitials = (email) => {
    if (!email) return 'U';
    const username = email.split('@')[0];
    return username.substring(0, 2).toUpperCase();
};
</script>
