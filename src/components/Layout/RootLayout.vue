<template>
  <div class="flex h-screen w-full bg-gray-50">
    <!-- 左侧侧边栏 -->
    <Sidebar />
    
    <!-- 右侧主内容区 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部导航栏 -->
      <TopBar />
      
      <!-- 内容区域 -->
      <main class="flex-1 overflow-auto p-4">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'
</script>