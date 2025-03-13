<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">最近访问</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
          <div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-4">
            <iconify-icon icon="material-symbols:history" class="text-gray-500" />
          </div>
          <div>
            <div class="font-medium">最近访问的白板 {{ i }}</div>
            <div class="text-sm text-gray-500">访问时间: {{ i }} 小时前</div>
          </div>
          <div class="ml-auto text-sm text-gray-500">
            所有者: 用户{{ i }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>