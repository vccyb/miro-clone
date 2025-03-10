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
        provider: provider,
        options: {
            redirectTo: `http://localhost:5173/auth/dev/callback`,
            skipBrowserRedirect: false,
            queryParams: {
                // 本地需要强制覆盖掉
                redirect_uri: 'http://localhost:5173/auth/dev/callback', // 强制 GitHub 使用本地地址
            },
        }
    })
    if (error) {
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