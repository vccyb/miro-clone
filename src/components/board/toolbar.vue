<template>
    <div class="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-md p-1.5 flex flex-col gap-2 shadow-md">
        <n-tooltip placement="right" trigger="hover">
            <template #trigger>
                <n-button quaternary :focusable="false" class="toolbar-btn">
                    <iconify-icon icon="lucide:mouse-pointer-2"></iconify-icon>
                </n-button>
            </template>
            选择工具
        </n-tooltip>

        <n-tooltip placement="right" trigger="hover">
            <template #trigger>
                <n-button quaternary :focusable="false" class="toolbar-btn">
                    <iconify-icon icon="lucide:type"></iconify-icon>
                </n-button>
            </template>
            文本工具
        </n-tooltip>

        <n-tooltip placement="right" trigger="hover">
            <template #trigger>
                <n-button quaternary :focusable="false" class="toolbar-btn">
                    <iconify-icon icon="lucide:sticky-note"></iconify-icon>
                </n-button>
            </template>
            便签工具
        </n-tooltip>

        <n-tooltip placement="right" trigger="hover">
            <template #trigger>
                <n-button quaternary :focusable="false" class="toolbar-btn">
                    <iconify-icon icon="lucide:square"></iconify-icon>
                </n-button>
            </template>
            矩形工具
        </n-tooltip>

        <n-tooltip placement="right" trigger="hover">
            <template #trigger>
                <n-button quaternary :focusable="false" class="toolbar-btn">
                    <iconify-icon icon="lucide:circle"></iconify-icon>
                </n-button>
            </template>
            圆形工具
        </n-tooltip>

        <n-tooltip placement="right" trigger="hover">
            <template #trigger>
                <n-button quaternary :focusable="false" class="toolbar-btn">
                    <iconify-icon icon="lucide:pencil"></iconify-icon>
                </n-button>
            </template>
            铅笔工具
        </n-tooltip>

        <n-divider style="margin: 4px 0;" />

        <n-tooltip placement="right" trigger="hover">
            <template #trigger>
                <n-button quaternary :focusable="false" class="toolbar-btn">
                    <iconify-icon icon="lucide:undo-2"></iconify-icon>
                </n-button>
            </template>
            撤销
        </n-tooltip>

        <n-tooltip placement="right" trigger="hover">
            <template #trigger>
                <n-button quaternary :focusable="false" class="toolbar-btn">
                    <iconify-icon icon="lucide:redo-2"></iconify-icon>
                </n-button>
            </template>
            重做
        </n-tooltip>
    </div>
</template>

<script setup>
import { NButton, NTooltip, NDivider } from 'naive-ui';
import { ref } from 'vue';

// 当前选中的工具
const selectedTool = ref('pointer');

// 选择工具的方法
const selectTool = (tool) => {
    selectedTool.value = tool;
};
</script>

<style scoped>
.toolbar-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.toolbar-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
</style>
