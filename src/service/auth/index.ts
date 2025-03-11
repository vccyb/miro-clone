import { supabase } from "@/lib/supabaseClient";
import type { RegisterForm, LoginForm } from "@/types/AuthForm";

import { useAuthStore } from "@/stores/auth";



export const registerFn = async (formValue: RegisterForm) => {
    const { data, error } = await supabase.auth.signUp({
        email: formValue.email,
        password: formValue.password,
    })
    if (error) {
        return false
    }

    return true
}

export const loginFn = async (formValue: LoginForm) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: formValue.email,
        password: formValue.password
    })
    if (error) {
        return false
    }

    return true
}

type Provider = 'google' | 'github'
export const oAuthFn = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: 'http://localhost:5173/auth/callback', // 使用与 GitHub 配置完全一致的 URL
            // 移除 queryParams 中的覆盖，避免冲突
        }
    })

    if (error) {
        console.error('OAuth error:', error)
        return false
    }
    return true
}

export const logoutFn = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        return false
    }
    return true
}