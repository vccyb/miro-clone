<template>
  <div class="container mx-auto">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Boards in this team</h1>
      <div class="flex space-x-4">
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
        <n-button :secondary="viewMode !== 'grid'" @click="viewMode = 'grid'">
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
        <n-button :secondary="viewMode !== 'list'" @click="viewMode = 'list'">
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

    <!-- 添加 loading 包装 -->
    <n-spin :show="loading">
      <!-- 表格视图 -->
      <n-data-table v-if="viewMode === 'list'" :loading="loading" :columns="columns" :data="tableData"
        :pagination="pagination" :bordered="false" :single-line="false" />

      <!-- 网格视图 -->
      <div v-else>
        <div class="grid grid-cols-3 gap-6">
          <div v-for="board in paginatedGridData" :key="board.id"
            class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <!-- 缩略图区域 -->
            <div class="h-50 bg-gray-50 flex items-center justify-center">
              <template v-if="board.image_url">
                <img :src="board.image_url" class="w-full h-full object-cover" :alt="board.title" />
              </template>
              <template v-else>
                <iconify-icon icon="material-symbols:dashboard-outline" width="48" height="48" class="text-gray-400" />
              </template>
            </div>

            <!-- 信息区域 -->
            <div class="p-5">
              <div class="flex items-center mb-3">
                <div class="flex-1">
                  <div class="font-medium text-lg">{{ board.title }}</div>
                  <div class="text-sm text-gray-500">
                    创建者: {{ board.author_name }}
                  </div>
                </div>
              </div>

              <div class="flex justify-between items-center mt-2">
                <div class="text-xs text-gray-500">
                  创建于: {{ new Date(board.created_at).toLocaleDateString() }}
                </div>
                <div class="text-xs text-gray-500">
                  更新于: {{ new Date(board.updated_at).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 网格视图的分页控件 -->
        <div class="flex justify-center mt-6">
          <n-pagination v-model:page="gridPagination.page" 
                       :page-count="gridPagination.pageCount" 
                       :page-size="gridPagination.pageSize"
                       :page-sizes="gridPagination.pageSizes"
                       :show-size-picker="true"
                       @update:page="gridPagination.onChange"
                       @update:page-size="gridPagination.onUpdatePageSize" />
        </div>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
// 添加 NPagination 到导入
import { NButton, NSelect, NDataTable, useMessage, NSpin, NPagination } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

import { getAllBoards } from '@/service/boards'
import type { Board } from '@/service/boards'

const router = useRouter()
const message = useMessage()




const tableData = ref<Board[]>([])
// 加载数据的方法
const loading = ref(false)

// 修改 loadBoards 方法
const loadBoards = async () => {
  loading.value = true
  try {
    const boards = await getAllBoards()
    tableData.value = boards
  } catch (error) {
    message.error(`加载白板列表失败,${error}`)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBoards()
})



// 视图模式：list 或 grid
const viewMode = ref('list')

// 模板数据

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
const columns: DataTableColumns<Board> = [
  {
    title: '白板名称',
    key: 'title',
    render(row: Board) {
      return h('div', { class: 'flex items-center' }, [
        h('div', { class: 'w-10 h-10 mr-3 bg-gray-100 rounded flex items-center justify-center overflow-hidden' }, [
          row.image_url
            ? h('img', {
              src: row.image_url,
              class: 'w-full h-full object-cover'
            })
            : h('iconify-icon', {
              icon: 'material-symbols:dashboard-outline',
              class: 'text-gray-400'
            })
        ]),
        h('div', [
          h('div', { class: 'font-medium' }, row.title),
          h('div', { class: 'text-xs text-gray-500' }, `创建者: ${row.author_name}`)
        ])
      ])
    }
  },
  {
    title: '创建时间',
    key: 'created_at',
    render(row: Board) {
      return new Date(row.created_at).toLocaleDateString()
    }
  },
  {
    title: '最后更新',
    key: 'updated_at',
    render(row: Board) {
      return new Date(row.updated_at).toLocaleDateString()
    }
  },
  {
    title: '创建者',
    key: 'author_name'
  }
]

// 表格数据
// const tableData = [
//   {
//     id: 1,
//     name: 'Sprint Planning',
//     modifiedBy: 'Job Chen',
//     modifiedDate: 'Today',
//     onlineUsers: 100,
//     icon: 'material-symbols:sprint',
//     lastOpened: 'Today',
//     owner: 'chen'
//   },
//   {
//     id: 2,
//     name: 'Product Roadmap',
//     modifiedBy: 'You',
//     modifiedDate: 'Yesterday',
//     onlineUsers: 2,
//     icon: 'material-symbols:map',
//     lastOpened: 'Yesterday',
//     owner: 'you'
//   },
//   {
//     id: 3,
//     name: 'UX Research',
//     modifiedBy: 'Sarah Wang',
//     modifiedDate: '3 days ago',
//     onlineUsers: 1,
//     icon: 'material-symbols:psychology',
//     lastOpened: '3 days ago',
//     owner: 'sarah'
//   }
// ]

// 网格视图分页设置
const gridPagination = reactive({
  page: 1,
  pageSize: 6, // 每页显示6个卡片
  pageCount: computed(() => Math.ceil(tableData.value.length / gridPagination.pageSize)),
  pageSizes: [6, 9, 12, 15],
  onChange: (page: number) => {
    gridPagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    gridPagination.pageSize = pageSize
    gridPagination.page = 1
  }
})

// 计算当前页的网格数据
const paginatedGridData = computed(() => {
  const start = (gridPagination.page - 1) * gridPagination.pageSize
  const end = start + gridPagination.pageSize
  return tableData.value.slice(start, end)
})

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

// 登出功能
</script>

<style scoped></style>
