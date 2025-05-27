<template>
  <div class="container mx-auto">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Boards in this team</h1>
      <div class="flex space-x-4">
        <!-- 移除 Explore templates 按钮 -->
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

      <!-- 添加搜索框和搜索按钮 -->
      <div class="flex items-center gap-2">
        <n-input v-model:value="searchQuery" placeholder="搜索白板..." size="medium" style="width: 200px"
          @keyup.enter="handleSearch" />
        <n-button size="medium" @click="handleSearch">搜索</n-button>

        <div class="flex gap-2 ml-2">
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
            class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            @click="navigateToBoard(board.id)"> <!-- 添加点击事件 -->
            <!-- 缩略图区域 -->
            <div class="h-50 bg-gray-50 flex items-center justify-center relative">
              <template v-if="board.image_url">
                <img :src="board.image_url" class="w-full h-full object-cover" :alt="board.title" />
              </template>
              <template v-else>
                <iconify-icon icon="material-symbols:dashboard-outline" width="48" height="48" class="text-gray-400" />
              </template>

              <!-- 修复按钮样式和点击问题 -->
              <div
                class="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <div class="bg-white/80 rounded-full shadow-sm w-8 h-8 flex items-center justify-center">
                  <FavoriteButton :board-id="board.id" @toggle="handleFavoriteToggle" />
                </div>
                <div class="bg-white/80 rounded-full shadow-sm w-8 h-8 flex items-center justify-center">
                  <MoreMenu :board-id="board.id" @rename="handleRename" @favorite="handleFavorite"
                    @delete="handleDelete" />
                </div>
              </div>

              <!-- 修改遮罩层，确保不会阻挡点击事件 -->
              <div
                class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              </div>
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
          <n-pagination v-model:page="gridPagination.page" :page-count="gridPagination.pageCount"
            :page-size="gridPagination.pageSize" :page-sizes="gridPagination.pageSizes" :show-size-picker="true"
            @update:page="gridPagination.onChange" @update:page-size="gridPagination.onUpdatePageSize" />
        </div>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NSelect, NDataTable, useMessage, NSpin, NPagination, NInput, useDialog } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

import { getAllBoards, createBoard, deleteBoard, type SortOption, type OwnerFilter, type BoardQueryParams } from '@/service/boards'
import type { Board } from '@/service/boards'
// 导入编码工具函数
import { encodeId } from '../utils/encoding'

// 导入自定义组件
import FavoriteButton from '@/components/BoardActions/FavoriteButton.vue'
import MoreMenu from '@/components/BoardActions/MoreMenu.vue'
import { useCanvasStore } from '@/stores/canvas.ts'

const router = useRouter()
const message = useMessage()

const tableData = ref<Board[]>([])
// 加载数据的方法
const loading = ref(false)

// 视图模式：list 或 grid
const viewMode = ref('list')

// 过滤和排序选项
const filterValue = ref('all')
const filterOptions = [
  { label: 'All boards', value: 'all' },
  // 移除 Recent boards 选项
  { label: 'Starred boards', value: 'starred' }
]

const ownerValue = ref('anyone')
const ownerOptions = [
  { label: 'Owned by anyone', value: 'anyone' },
  { label: 'Owned by me', value: 'me' },
  { label: 'Owned by others', value: 'others' }
]

// 修改默认排序值和排序选项
const sortValue = ref<string>('last-modified')
const sortOptions = [
  // 移除 Last opened 选项
  { label: 'Last created', value: 'last-created' },
  { label: 'Last modified', value: 'last-modified' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' }
]

// 添加搜索相关的状态
const searchQuery = ref('')

// 修改 loadBoards 方法，使用 BoardQueryParams 对象
const loadBoards = async () => {
  loading.value = true
  try {
    // 构建查询参数对象
    const params: BoardQueryParams = {
      sortBy: sortValue.value as SortOption,
      owner: ownerValue.value as OwnerFilter,
      filter: filterValue.value,
      search: searchQuery.value // 添加搜索参数
    }

    // 将参数对象传递给 getAllBoards
    const boards = await getAllBoards(params)
    tableData.value = boards
  } catch (error) {
    message.error(`加载白板列表失败,${error}`)
  } finally {
    loading.value = false
  }
}

// 监听排序值和筛选值变化，重新加载数据
watch([sortValue, ownerValue, filterValue], () => {
  loadBoards()
})


const handleSearch = () => {
  loadBoards()
}

onMounted(() => {
  loadBoards()
})



// 表格列定义
const columns: DataTableColumns<Board> = [
  {
    title: '白板名称',
    key: 'title',
    render(row: Board) {
      return h('div', {
        class: 'flex items-center cursor-pointer',
        onClick: () => navigateToBoard(row.id)  // 添加点击事件
      }, [
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
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row: Board) {
      return h('div', { class: 'flex space-x-1 justify-end' }, [
        h(FavoriteButton, {
          boardId: row.id,
          onToggle: (id: string, state: boolean) => handleFavoriteToggle(id, state)
        }),
        h(MoreMenu, {
          boardId: row.id,
          onRename: (id: string) => handleRename(id),
          onFavorite: (id: string) => handleFavorite(id),
          onDelete: (id: string) => handleDelete(id)
        })
      ])
    }
  }
]


// 网格视图分页设置
interface GridPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  pageSizes: number[];
  onChange: (page: number) => void;
  onUpdatePageSize: (pageSize: number) => void;
}

const gridPagination: GridPagination = reactive({
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


const canvasStore = useCanvasStore()

// 处理创建新白板
const handleCreateNew = async () => {
  loading.value = true
  try {
    // 创建一个默认标题为 Untitled 的白板
    const newBoard = await createBoard('Untitled')

    canvasStore.clearStore()

    if (newBoard) {
      message.success('白板创建成功')

      // 生成编码后的路由
      const encodedId = encodeId(newBoard.id)

      // 跳转到新创建的白板
      router.push(`/board/${encodedId}`)
    } else {
      message.error('白板创建失败')
    }
  } catch (error) {
    message.error(`创建白板失败: ${error}`)
  } finally {
    loading.value = false
  }
}

// 处理选择模板

// 登出功能
// 添加处理函数
const handleFavoriteToggle = (id: string, state: boolean) => {
  message.info(`${state ? '收藏' : '取消收藏'}白板: ${id}`)
  // 这里可以添加收藏/取消收藏的逻辑
}

const handleRename = (id: string) => {
  message.info(`重命名白板: ${id}`)
  // 这里可以添加重命名的逻辑
}

const handleFavorite = (id: string) => {
  message.info(`收藏白板: ${id}`)
  // 这里可以添加收藏的逻辑
}

const dialog = useDialog()

const handleDelete = async (id: string) => {
  dialog.warning({
    title: '删除白板',
    content: '确定要删除这个白板吗？此操作不可撤销。',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      loading.value = true
      try {
        const success = await deleteBoard(id)
        if (success) {
          message.success('白板删除成功')
          // 重新加载白板列表
          await loadBoards()
        } else {
          message.error('删除白板失败')
        }
      } catch (error) {
        message.error(`删除白板失败: ${error}`)
      } finally {
        loading.value = false
      }
    }
  })
}

// 添加导航到白板详情的方法
const navigateToBoard = (boardId: string) => {
  // 使用 encodeId 函数编码 ID
  const encodedId = encodeId(boardId)
  // 导航到白板详情页
  router.push(`/board/${encodedId}`)
}
</script>

<style scoped></style>
