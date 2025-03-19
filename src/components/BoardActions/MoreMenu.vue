<template>
  <n-dropdown :options="options" trigger="click" @select="handleSelect">
    <div class="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
      <iconify-icon icon="ph:dots-three-outline-fill" width="20" height="20" />
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { NDropdown, useMessage } from 'naive-ui'

const message = useMessage()

const props = defineProps<{
  boardId: string
}>()

const emit = defineEmits<{
  (e: 'rename', id: string): void
  (e: 'favorite', id: string): void
  (e: 'delete', id: string): void
}>()

const options = [
  {
    label: '重命名',
    key: 'rename',
    icon: () => h('iconify-icon', { icon: 'material-symbols:edit-outline' })
  },
  {
    label: '收藏',
    key: 'favorite',
    icon: () => h('iconify-icon', { icon: 'material-symbols:star-outline' })
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '删除',
    key: 'delete',
    icon: () => h('iconify-icon', { icon: 'material-symbols:delete-outline' }),
    props: {
      style: {
        color: '#d03050'
      }
    }
  }
]

const handleSelect = (key: string) => {
  switch (key) {
    case 'rename':
      emit('rename', props.boardId)
      break
    case 'favorite':
      emit('favorite', props.boardId)
      break
    case 'delete':
      emit('delete', props.boardId)
      break
  }
}
</script>