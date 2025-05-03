<template>
    <n-modal :show="showModal" @update:show="handleModalUpdate">
        <n-card style="width: 600px" title="请修改白板的名字" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-input v-model:value="boardTitle" placeholder="请输入白板名称" @keyup.enter="handleConfirm"></n-input>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <n-button @click="handleCancel">取消</n-button>
                    <n-button type="primary" :loading="loading" @click="handleConfirm">确定</n-button>
                </div>
            </template>
        </n-card>
    </n-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
    NModal,
    NCard,
    NInput,
    NButton,
    useMessage
} from 'naive-ui'
import { updateBoard } from '@/service/boards'

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    boardId: {
        type: String,
        required: true
    },
    initialTitle: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:showModal', 'renamed'])

const message = useMessage()
const boardTitle = ref(props.initialTitle)
const loading = ref(false)

// 当初始标题变化时更新输入框
watch(() => props.initialTitle, (newTitle) => {
    boardTitle.value = newTitle
})

// 处理模态框显示状态变化
const handleModalUpdate = (value) => {
    emit('update:showModal', value)
}

// 处理取消按钮点击
const handleCancel = () => {
    emit('update:showModal', false)
}

// 处理确认按钮点击
const handleConfirm = async () => {
    if (!boardTitle.value.trim()) {
        message.warning('白板名称不能为空')
        return
    }

    loading.value = true
    try {
        const updatedBoard = await updateBoard(props.boardId, { title: boardTitle.value.trim() })
        if (updatedBoard) {
            emit('renamed', updatedBoard)
            emit('update:showModal', false)
        } else {
            message.error('修改白板名称失败')
        }
    } catch (error) {
        console.error('修改白板名称出错:', error)
        message.error('修改白板名称失败')
    } finally {
        loading.value = false
    }
}
</script>
