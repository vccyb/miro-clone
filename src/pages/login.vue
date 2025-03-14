<template>
    <div class="min-h-screen flex items-center justify-centermax-w-[60%]  ">
        <n-card content-style="padding: 0;" class="flex  w-[800px] p-0 overflow-hidden shadow-2xl">
            <div class="flex flex-row ">

                <!-- 左侧登录表单 -->
                <div class="w-[360px] p-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">登录</h2>
                    <n-form ref="formRef" :model="formValue" :rules="rules">
                        <n-form-item label="邮箱地址" path="email">
                            <n-input v-model:value="formValue.email" placeholder="请输入邮箱地址" size="large">
                                <template #prefix>
                                    <iconify-icon icon="material-symbols:mail-outline" />
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item label="登录密码" path="password">
                            <n-input v-model:value="formValue.password" type="password" placeholder="请输入登录密码"
                                size="large" show-password-on="click" @keyup.enter="handleLogin">
                                <template #prefix>
                                    <iconify-icon icon="material-symbols:lock-outline" />
                                </template>
                            </n-input>
                        </n-form-item>

                        <div class="flex justify-between items-center mb-6">
                            <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
                            <n-button text type="primary" size="small" @click="router.push('/forgot-password')">
                                忘记密码？
                            </n-button>
                        </div>

                        <n-button type="primary" block size="large" :loading="loading" @click="handleLogin">
                            登录
                        </n-button>

                        <div class="mt-6">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center">
                                    <div class="w-full border-t border-gray-200"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                    <span class="px-2 bg-white text-gray-500">其他登录方式</span>
                                </div>
                            </div>

                            <div class="mt-6 grid grid-cols-2 gap-3">
                                <n-button size="large" @click="handleOAuthLogin('github')">
                                    <template #icon>
                                        <iconify-icon icon="mdi:github" width="20"></iconify-icon>
                                    </template>
                                    GitHub
                                </n-button>
                                <n-button size="large" @click="handleOAuthLogin('google')">
                                    <template #icon>
                                        <iconify-icon icon="mdi:google" width="20"></iconify-icon>
                                    </template>
                                    Google
                                </n-button>
                            </div>
                        </div>

                        <div class="mt-6 text-center text-sm text-gray-500">
                            还没有账号？
                            <n-button text type="primary" size="small" @click="router.push('/register')">
                                立即注册
                            </n-button>
                        </div>
                    </n-form>
                </div>

                <!-- 右侧图片区域 -->
                <div class="flex-1 bg-gradient-to-br from-blue-400 to-indigo-500 p-8 flex items-center justify-center">
                    <div class="relative w-full h-full">
                        <img src="@/assets/images/login-illustration.svg" alt="Login Illustration"
                            class="w-full h-full object-contain" />
                        <div class="absolute bottom-0 left-0 right-0 text-white text-center pb-8">
                            <h3 class="text-xl font-semibold mb-2">在线白板协作工具</h3>
                            <p class="text-sm opacity-80">让创意和协作变得更简单</p>
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
import { loginFn, oAuthFn } from '@/service/auth'

const router = useRouter()
const message = useMessage()
const formRef = ref<typeof NForm | null>(null)
const loading = ref(false)
const rememberMe = ref(false)

const formValue = reactive({
    email: '',
    password: ''
})

const rules: FormRules = {
    email: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '请输入正确的邮箱格式' }
    ],
    password: [
        { required: true, message: '请输入密码' },
        { min: 6, message: '密码长度不能小于6位' }
    ]
}

const handleLogin = async () => {
    try {
        // 表单验证
        try {
            await formRef.value?.validate()
        } catch (error: any) {
            return message.error('请正确输入账号和密码!')
        }

        loading.value = true
        const isLogin = await loginFn(formValue)
        if (!isLogin) { // 登录失败
            return message.error('账号或密码错误')
        }
        message.success('登录成功')
        router.push('/')
    } catch (error: any) {

    } finally {
        loading.value = false
    }
}


type Provider = 'github' | 'google'

const handleOAuthLogin = async (provider: Provider) => {
    const isLogin = await oAuthFn(provider)
    if (!isLogin) {
        return message.error('登录失败')
    }
    router.push('/')
}

</script>