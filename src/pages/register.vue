<template>
    <div class="min-h-screen flex items-center justify-centermax-w-[60%]">
        <n-card content-style="padding: 0;" class="flex w-[800px] p-0 overflow-hidden shadow-2xl">
            <div class="flex flex-row">
                <!-- 左侧注册表单 -->
                <div class="w-[360px] p-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">注册账号</h2>
                    <n-form ref="formRef" :model="formValue" :rules="rules">
                        <n-form-item label="用户名" path="username">
                            <n-input v-model:value="formValue.username" placeholder="请输入用户名" size="large">
                                <template #prefix>
                                    <iconify-icon icon="material-symbols:person-outline" />
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item label="邮箱地址" path="email">
                            <n-input v-model:value="formValue.email" placeholder="请输入邮箱地址" size="large">
                                <template #prefix>
                                    <iconify-icon icon="material-symbols:mail-outline" />
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item label="设置密码" path="password">
                            <n-input v-model:value="formValue.password" type="password" show-password-on="click"
                                placeholder="请设置密码" size="large">
                                <template #prefix>
                                    <iconify-icon icon="material-symbols:lock-outline" />
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item label="确认密码" path="confirmPassword">
                            <n-input v-model:value="formValue.confirmPassword" type="password" show-password-on="click"
                                placeholder="请确认密码" size="large">
                                <template #prefix>
                                    <iconify-icon icon="material-symbols:lock-outline" />
                                </template>
                            </n-input>
                        </n-form-item>

                        <div class="mb-6">
                            <n-checkbox v-model:checked="agreeTerms">
                                我已阅读并同意
                                <n-button text type="primary" size="small">服务条款</n-button>
                                和
                                <n-button text type="primary" size="small">隐私政策</n-button>
                            </n-checkbox>
                        </div>

                        <n-button type="primary" block size="large" :loading="loading" @click="handleRegister">
                            注册
                        </n-button>

                        <div class="mt-6 text-center text-sm text-gray-500">
                            已有账号？
                            <n-button text type="primary" size="small" @click="router.push('/login')">
                                立即登录
                            </n-button>
                        </div>
                    </n-form>
                </div>

                <!-- 右侧图片区域 -->
                <div class="flex-1 bg-gradient-to-br from-blue-400 to-indigo-500 p-8 flex items-center justify-center">
                    <div class="relative w-full h-full">
                        <img src="@/assets/images/register-illustration.svg" alt="Register Illustration"
                            class="w-full h-full object-contain" />
                        <div class="absolute bottom-0 left-0 right-0 text-white text-center pb-8">
                            <h3 class="text-xl font-semibold mb-2">开启您的创作之旅</h3>
                            <p class="text-sm opacity-80">加入我们，让创意无限可能</p>
                        </div>
                    </div>
                </div>
            </div>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, NCard, NButton, NForm, NFormItem, NInput, NCheckbox } from 'naive-ui'
import type { FormRules } from 'naive-ui'
import { supabase } from '@/lib/supabaseClient'
import { registerFn } from '@/service/auth'

const router = useRouter()
const message = useMessage()
const formRef = ref<typeof NForm | null>(null)
const loading = ref(false)
const agreeTerms = ref(false)

const formValue = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const rules: FormRules = {
    username: [
        { required: true, message: '请输入用户名' },
        { min: 2, message: '用户名长度不能小于2位' }
    ],
    email: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '请输入正确的邮箱格式' }
    ],
    password: [
        { required: true, message: '请输入密码' },
        { min: 6, message: '密码长度不能小于6位' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码' },
        {
            validator: (rule, value) => value === formValue.password,
            message: '两次输入的密码不一致'
        }
    ]
}

const handleRegister = async () => {
    if (!agreeTerms.value) {
        message.error('请先同意服务条款和隐私政策')
        return
    }
    try {
        // 校验表单
        try {
            await formRef.value?.validate()
        } catch (error: any) {
            return message.error('表单校验失败!')
        }
        loading.value = true
        const isRegistered = await registerFn(formValue)
        if (!isRegistered) {
            return message.error('注册失败')
        }
        message.success('注册成功，请查收邮件完成验证')
        router.push('/login')
    } catch (error: any) {
        message.error(error.message || '注册失败')
    } finally {
        loading.value = false
    }

}


</script>