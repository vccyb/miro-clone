<template>
  <div class="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
    <n-tooltip placement="bottom" trigger="hover">
      <template #trigger>
        <n-button quaternary :focusable="false" @click="$router.push('/')">
          <span class="font-bold text-[120%]">VBorad</span>
        </n-button>
      </template>
      返回主页
    </n-tooltip>
    <n-divider vertical />
    <n-tooltip placement="bottom" trigger="hover">
      <template #trigger>
        <n-button quaternary :focusable="false" @click="showRenameModal = true">
          {{ boardTitle }}
        </n-button>
      </template>
      点击修改白板名称
    </n-tooltip>
    <n-divider vertical />
    <n-tooltip placement="bottom" trigger="hover">
      <template #trigger>
        <n-button quaternary :focusable="false">
          <iconify-icon icon="lucide:menu"></iconify-icon>
        </n-button>
      </template>
      更多选项
    </n-tooltip>
  </div>
  <RenameModal
    :showModal="showRenameModal"
    @update:showModal="showRenameModal = $event"
    :boardId="decodedBoardId"
    :initialTitle="boardTitle"
    @renamed="handleRenamed"
  />
</template>

<script setup lang="ts">
import { NButton, NDivider, NTooltip, useMessage } from 'naive-ui'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { decodeId } from '@/utils/encoding'
import { getBoardById } from '@/service/boards'
import RenameModal from '@/components/BoardActions/RenameModal.vue'
import { useCanvasStore } from '@/stores/canvas.ts'

const route = useRoute()
const message = useMessage()
const boardId = ref(route.params.id)
const decodedBoardId = ref('')
const boardTitle = ref('')
const showRenameModal = ref(false)

// 处理重命名成功后的回调
const handleRenamed = (updatedBoard) => {
  boardTitle.value = updatedBoard.title
  message.success('白板名称已更新')
}

// get board info
onMounted(async () => {
  try {
    decodedBoardId.value = decodeId(boardId.value)
    const board = await getBoardById(decodedBoardId.value)
    if (board) {
      boardTitle.value = board.title
      if (board.content) {
        canvasStore.loadContent(board.content)
      }
    } else {
      message.error('获取白板信息失败')
    }
  } catch (e) {
    console.error('获取白板信息出错:', e)
    message.error('获取白板信息失败')
  }
})

const canvasStore = useCanvasStore()


// 自动保存
let saveTimeout = ref<null | ReturnType<typeof setTimeout>>(null)

const triggerAutoSave = () => {
  if (saveTimeout.value !== null) {
    clearTimeout(saveTimeout.value)
  }
  saveTimeout.value = setTimeout(async () => {
    try {
      await canvasStore.saveContent(decodedBoardId.value)
    } catch (error) {
      console.error('自动保存失败', error)
    }
  }, 2000)
}

watch(
  () => canvasStore.layers,
  () => {
    console.log('触发自动保存')
    triggerAutoSave()
  },
  { deep: true },
)

// 处理保存内容
const handleSaveContent = async () => {
  try {
    await canvasStore.saveContent(decodedBoardId.value)
  } catch (e) {
    console.error('保存内容出错:', e)
  }
  console.log('保存内容成功')
}
</script>
