<template>
    <n-tooltip placement="right" trigger="hover">
        <template #trigger>
            <n-button :focusable="false" class="toolbar-btn" @click="onClick" :disabled="isDisabled"
                :type="isActive ? 'info' : 'default'" :quaternary="isActive ? false : true">
                <iconify-icon :icon="icon"></iconify-icon>
            </n-button>
        </template>
        {{ label }}
    </n-tooltip>
</template>

<script setup lang="ts">
import { NButton, NTooltip } from 'naive-ui';


interface ToolButtonProps {
    label: string
    icon: string
    onClick: () => void
    isActive?: boolean
    isDisabled?: boolean
}

const props = defineProps<ToolButtonProps>()
</script>
