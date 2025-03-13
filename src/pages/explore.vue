<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">探索模板</h1>
      <div class="flex space-x-3">
        <n-button type="primary">
          <template #icon>
            <iconify-icon icon="material-symbols:add" />
          </template>
          创建模板
        </n-button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
        <div class="h-40 bg-gray-50 flex items-center justify-center">
          <iconify-icon icon="material-symbols:dashboard-customize-outline" width="48" height="48" class="text-gray-400" />
        </div>
        <div class="p-4">
          <div class="font-medium">模板 {{ i }}</div>
          <div class="text-sm text-gray-500 mt-1">适用于团队协作的白板模板</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
</script>