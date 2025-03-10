import { supabase } from "@/lib/supabaseClient";
import type { RegisterForm, LoginForm } from "@/types/AuthForm";

import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore()


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


export const logoutFn = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        return false
    }
    return true
}