<template>
    <div class="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-md p-1.5 flex flex-col gap-2 shadow-md">
        <toolbarButton label="选择工具" icon="lucide:mouse-pointer-2" :onClick="() => selectTool('pointer')"
            :isActive="selectedTool === 'pointer'" />

        <toolbarButton label="文本工具" icon="lucide:type" :onClick="() => selectTool('text')"
            :isActive="selectedTool === 'text'" />

        <toolbarButton label="便签工具" icon="lucide:sticky-note" :onClick="() => selectTool('note')"
            :isActive="selectedTool === 'note'" />

        <toolbarButton label="矩形工具" icon="lucide:square" :onClick="() => selectTool('rectangle')"
            :isActive="selectedTool === 'rectangle'" />

        <toolbarButton label="圆形工具" icon="lucide:circle" :onClick="() => selectTool('circle')"
            :isActive="selectedTool === 'circle'" />

        <toolbarButton label="铅笔工具" icon="lucide:pencil" :onClick="() => selectTool('pencil')"
            :isActive="selectedTool === 'pencil'" />

        <n-divider style="margin: 4px 0;" />

        <toolbarButton label="撤销" icon="lucide:undo-2" :onClick="() => handleUndo()" />

        <toolbarButton label="重做" icon="lucide:redo-2" :onClick="() => handleRedo()" />
    </div>
</template>

<script setup>
import { NDivider } from 'naive-ui';
import toolbarButton from './toolbarButton.vue'
import { ref } from 'vue';

// 当前选中的工具
const selectedTool = ref('pointer');

// 选择工具的方法
const selectTool = (tool) => {
    selectedTool.value = tool;
    console.log(`已选择工具: ${tool}`);
};

// 撤销操作
const handleUndo = () => {
    console.log('执行撤销操作');
    // 这里添加撤销逻辑
};

// 重做操作
const handleRedo = () => {
    console.log('执行重做操作');
    // 这里添加重做逻辑
};
</script>

<style scoped>
/* 可以移除这些样式，因为它们已经在 toolbarButton 组件中定义 */
</style>
