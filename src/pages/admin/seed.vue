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
import { h, ref } from 'vue'
import { NButton, NSpace, NAlert, NCard, NDataTable, useMessage } from 'naive-ui'
import { generateBoards } from '@/service/seed'
import { supabase } from '@/lib/supabaseClient'

const message = useMessage()
// 为每种类型创建独立的loading状态
const loadingStates = ref({
    boards: false,
    teams: false
})

// 生成团队的函数
const generateTeams = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('需要登录才能生成测试数据')
    }

    // 生成团队数据
    const teams = Array.from({ length: 5 }, (_, index) => ({
        name: `测试团队 ${index + 1}`,
        description: `这是一个测试团队 ${index + 1}`,
        logo_url: null, // 暂时不设置logo
        owner_id: user.id
    }))

    // 插入团队数据
    const { data, error } = await supabase.from('teams').insert(teams)

    if (error) {
        throw new Error(`生成团队测试数据失败: ${error.message}`)
    }

    return true
}

const handleGenerateData = async (type: string) => {
    // 设置对应类型的loading状态
    loadingStates.value[type as keyof typeof loadingStates.value] = true
    
    try {
        if (type === 'boards') {
            await generateBoards()
            message.success('白板数据生成成功')
        } else if (type === 'teams') {
            await generateTeams()
            message.success('团队数据生成成功')
        }
    } catch (error: any) {
        message.error(error.message || '生成数据失败')
    } finally {
        // 重置对应类型的loading状态
        loadingStates.value[type as keyof typeof loadingStates.value] = false
    }
}

const columns = [
    {
        title: '功能',
        key: 'feature',
        width: 200
    },
    {
        title: '描述',
        key: 'description'
    },
    {
        title: '操作',
        key: 'actions',
        width: 150,
        render: (row: any) => {
            return h(
                NButton,
                {
                    type: 'primary',
                    // 使用对应类型的loading状态
                    loading: loadingStates.value[row.type as keyof typeof loadingStates.value],
                    onClick: () => handleGenerateData(row.type)
                },
                { default: () => '生成数据' }
            )
        }
    }
]

const mockData = [
    {
        feature: '白板',
        description: '生成10个随机白板数据',
        type: 'boards'
    },
    {
        feature: '团队',
        description: '生成5个随机团队数据',
        type: 'teams'
    }
]
</script>