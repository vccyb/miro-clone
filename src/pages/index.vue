<template>
  <div class="container mx-auto">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Boards in this team</h1>
      <div class="flex space-x-3">
        <n-button @click="router.push('/templates')">Explore templates</n-button>
        <n-button type="primary" @click="handleCreateNew">
          <template #icon>
            <iconify-icon icon="material-symbols:add" />
          </template>
          Create new
        </n-button>
      </div>
    </div>



    <!-- 过滤和排序选项 -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-500">Filter by</span>
        <n-select v-model:value="filterValue" :options="filterOptions" size="small" style="width: 150px" />
        <n-select v-model:value="ownerValue" :options="ownerOptions" size="small" style="width: 180px" />
        <n-select v-model:value="sortValue" :options="sortOptions" size="small" style="width: 150px" />
      </div>

      <div class="flex gap-2">
        <n-button secondary>
          <template #icon>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
              class="c-hdkwsG c-hdkwsG-dvzWZT-size-medium c-hdkwsG-OzWqL-weight-normal">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="var(--svg-stroke-width)"
                d="M9.5 14h-5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5ZM19.5 14h-5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5ZM9.5 4h-5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5ZM19.5 4h-5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5Z">
              </path>
              <path stroke="currentColor" stroke-width="var(--svg-stroke-width)" d="M10 10v.0001"></path>
            </svg>
          </template>
        </n-button>
        <n-button secondary>
          <template #icon>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
              class="c-hdkwsG c-hdkwsG-dvzWZT-size-medium c-hdkwsG-OzWqL-weight-normal">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="var(--svg-stroke-width)" d="M9 5h12m-12 7h12m-12 7h12"></path>
              <path fill="currentColor"
                d="M5 12c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5.6716-1.5 1.5-1.5 1.5.6716 1.5 1.5ZM5 19c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5.6716-1.5 1.5-1.5 1.5.6716 1.5 1.5ZM5 5c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5.6716-1.5 1.5-1.5 1.5.6716 1.5 1.5Z">
              </path>
              <path stroke="currentColor" stroke-width="var(--svg-stroke-width)" d="M12 12v.0001"></path>
            </svg>
          </template>
        </n-button>
      </div>

    </div>

    <!-- 表格 -->
    <n-data-table :columns="columns" :data="tableData" :pagination="pagination" :bordered="false"
      :single-line="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NSelect, NDataTable, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { logoutFn } from "@/service/auth"

const router = useRouter()
const message = useMessage()

// 模板数据
const templates = [
  {
    name: 'Blank board',
    type: 'blank',
    image: '/images/templates/blank.svg'
  },
  {
    name: 'Flowchart',
    type: 'flowchart',
    image: '/images/templates/flowchart.svg'
  },
  {
    name: 'Mind Map',
    type: 'mindmap',
    image: '/images/templates/mindmap.svg'
  },
  {
    name: 'Kanban Framework',
    type: 'kanban',
    image: '/images/templates/kanban.svg'
  },
  {
    name: 'From Miroverse',
    type: 'miroverse',
    image: '/images/templates/miroverse.svg'
  }
]

// 过滤和排序选项
const filterValue = ref('all')
const filterOptions = [
  { label: 'All boards', value: 'all' },
  { label: 'Recent boards', value: 'recent' },
  { label: 'Starred boards', value: 'starred' }
]

const ownerValue = ref('anyone')
const ownerOptions = [
  { label: 'Owned by anyone', value: 'anyone' },
  { label: 'Owned by me', value: 'me' },
  { label: 'Owned by others', value: 'others' }
]

const sortValue = ref('last-opened')
const sortOptions = [
  { label: 'Last opened', value: 'last-opened' },
  { label: 'Last created', value: 'last-created' },
  { label: 'Last modified', value: 'last-modified' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' }
]

// 表格列定义
const columns = [
  {
    title: 'Name',
    key: 'name',
    render(row: any) {
      return h('div', { class: 'flex items-center' }, [
        h('div', { class: 'w-10 h-10 mr-3 bg-gray-100 rounded flex items-center justify-center' }, [
          h('iconify-icon', { icon: row.icon || 'material-symbols:dashboard-outline' })
        ]),
        h('div', [
          h('div', { class: 'font-medium' }, row.name),
          h('div', { class: 'text-xs text-gray-500' }, `Modified by ${row.modifiedBy}, ${row.modifiedDate}`)
        ])
      ])
    }
  },
  {
    title: 'Online users',
    key: 'onlineUsers',
    width: 150,
    render(row: any) {
      return h('div', { class: 'flex justify-start' }, [
        row.onlineUsers > 0
          ? h('div', { class: 'bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded' }, `${row.onlineUsers} online`)
          : null
      ])
    }
  },
  {
    title: 'Last Opened',
    key: 'lastOpened',
  },
  {
    title: 'Owner',
    key: 'owner'
  }
]

// 表格数据
const tableData = [
  {
    id: 1,
    name: 'Sprint Planning',
    modifiedBy: 'Job Chen',
    modifiedDate: 'Today',
    onlineUsers: 100,
    icon: 'material-symbols:sprint',
    lastOpened: 'Today',
    owner: 'chen'

  },
  {
    id: 2,
    name: 'Product Roadmap',
    modifiedBy: 'You',
    modifiedDate: 'Yesterday',
    onlineUsers: 2,
    icon: 'material-symbols:map'
  },
  {
    id: 3,
    name: 'UX Research',
    modifiedBy: 'Sarah Wang',
    modifiedDate: '3 days ago',
    onlineUsers: 1,
    icon: 'material-symbols:psychology'
  }
]

// 分页设置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})

// 处理创建新白板
const handleCreateNew = () => {
  message.info('创建新白板')
  // 这里可以添加创建白板的逻辑
}

// 处理选择模板
const handleSelectTemplate = (type: string) => {
  message.info(`选择了 ${type} 模板`)
  // 这里可以添加选择模板的逻辑
}

// 登出功能
const logout = async () => {
  await logoutFn()
  router.push('/login')
}
</script>

<style scoped></style>
