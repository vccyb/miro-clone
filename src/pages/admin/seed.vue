<template>
    <div class="p-8">
        <n-card title="数据管理">
            <n-space vertical>
                <n-alert type="warning">
                    注意：此功能仅用于开发测试，请勿在生产环境中使用。
                </n-alert>
                <n-button :loading="loading" type="primary" @click="handleGenerateData">
                    生成测试数据
                </n-button>
                <n-alert v-if="message" :type="messageType">
                    {{ message }}
                </n-alert>
            </n-space>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateBoards } from '@/service/seed/index.ts'
import { useMessage, NCard, NButton, NSpace, NAlert } from 'naive-ui'

const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const messageApi = useMessage()

const handleGenerateData = async () => {
    loading.value = true
    message.value = ''

    try {
        await generateBoards()
        messageType.value = 'success'
        message.value = '测试数据生成成功！'
        messageApi.success('测试数据已生成')
    } catch (error) {
        messageType.value = 'error'
        message.value = error instanceof Error ? error.message : '生成测试数据失败'
        messageApi.error(message.value)
    } finally {
        loading.value = false
    }
}
</script>