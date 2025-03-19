<template>
  <div class="cursor-pointer text-gray-400 hover:text-yellow-500 p-1 rounded-full hover:bg-gray-100"
    :class="{ 'text-yellow-500': isFavorite }" @click="toggleFavorite">
    <iconify-icon :icon="isFavorite ? 'material-symbols:star' : 'material-symbols:star-outline'" width="20" height="20" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  boardId: string
  initialState?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string, state: boolean): void
}>()

const isFavorite = ref(props.initialState || false)

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('toggle', props.boardId, isFavorite.value)
}
</script>