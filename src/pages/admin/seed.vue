<template>
    <div class="p-8">
        <n-card title="Mock数据管理">
            <n-space vertical>
                <n-alert type="warning">
                    注意：此功能仅用于开发测试，请勿在生产环境中使用，mock数据会真实更新到supabase
                </n-alert>

                <n-data-table :columns="columns" :data="mockData" :bordered="false" :single-line="false" />
            </n-space>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { generateBoards } from '@/service/seed'
import { useMessage, NCard, NButton, NSpace, NAlert, NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const loading = ref(false)
const messageApi = useMessage()

const handleGenerateData = async () => {
    loading.value = true

    try {
        await generateBoards()
        messageApi.success('测试数据生成成功！')
    } catch (error) {
        messageApi.error(error instanceof Error ? error.message : '生成测试数据失败')
    } finally {
        loading.value = false
    }
}

const columns: DataTableColumns = [
    {
        title: '数据类型',
        key: 'type',
        width: 200
    },
    {
        title: '说明',
        key: 'description'
    },
    {
        title: '操作',
        key: 'actions',
        width: 150,
        render: () => {
            return h(
                NButton,
                {
                    size: 'small',
                    type: 'primary',
                    loading: loading.value,
                    onClick: () => handleGenerateData()
                },
                { default: () => '生成数据' }
            )
        }
    }
]

const mockData = [
    {
        type: '白板数据',
        description: '生成10条随机的白板数据，包含标题、创建者、创建时间等信息。每条数据都会关联到当前登录用户。'
    }
]
</script>