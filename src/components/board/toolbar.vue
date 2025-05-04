<template>
    <div class="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-md p-1.5 flex flex-col gap-2 shadow-md">
        <toolbarButton label="选择工具" icon="lucide:mouse-pointer-2"
            :onClick="() => setCanvasState({ mode: CanvasMode.None })" :isActive="canvasState.mode === CanvasMode.None ||
                canvasState.mode === CanvasMode.Translating ||
                canvasState.mode === CanvasMode.SelecctionNet ||
                canvasState.mode === CanvasMode.Pressinng ||
                canvasState.mode === CanvasMode.Resizing
                " />

        <toolbarButton label="文本工具" icon="lucide:type"
            :onClick="() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Text })"
            :isActive="canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text" />

        <toolbarButton label="便签工具" icon="lucide:sticky-note"
            :onClick="() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Note })"
            :isActive="canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note" />

        <toolbarButton label="矩形工具" icon="lucide:square"
            :onClick="() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Reacangle })"
            :isActive="canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Reacangle" />

        <toolbarButton label="圆形工具" icon="lucide:circle"
            :onClick="() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Ellipse })"
            :isActive="canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse" />

        <toolbarButton label="铅笔工具" icon="lucide:pencil" :onClick="() => setCanvasState({ mode: CanvasMode.Pencil })"
            :isActive="canvasState.mode === CanvasMode.Pencil" />

        <n-divider style="margin: 4px 0;" />

        <toolbarButton label="撤销" icon="lucide:undo-2" :onClick="() => handleUndo()" />

        <toolbarButton label="重做" icon="lucide:redo-2" :onClick="() => handleRedo()" />
    </div>
</template>

<script setup lang="ts">
import { NDivider } from 'naive-ui';
import toolbarButton from './toolbarButton.vue'
import { ref } from 'vue';
import type { CanvasState } from "@/types/canvas"
import { CanvasMode, LayerType } from "@/types/canvas"

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

defineProps<ToolbarProps>();



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
