import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth-store', () => {
    const user = ref<null | User>(null)
    const isLoading = ref(false)
    const isTrackingAuthChanges = ref(false)

    // 设置用户信息
    const setUser = (userSession: null | Session = null) => {
        if (!userSession) {
            user.value = null
            return
        }
        user.value = userSession.user
    }

    // 获取会话信息
    const getSession = async () => {
        isLoading.value = true
        try {
            const { data, error } = await supabase.auth.getSession()
            if (error) throw error
            
            if (data.session?.user) {
                setUser(data.session)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('获取会话失败:', error)
            setUser(null)
        } finally {
            isLoading.value = false
        }
    }

    // 监听认证状态变化
    const trackAuthChanges = () => {
        if (isTrackingAuthChanges.value) return
        isTrackingAuthChanges.value = true
        
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('认证状态变化:', event)
            
            switch (event) {
                case 'SIGNED_IN':
                    setUser(session)
                    break
                case 'SIGNED_OUT':
                    setUser(null)
                    break
                case 'TOKEN_REFRESHED':
                    setUser(session)
                    break
            }
        })
    }

    return {
        user,
        isLoading,
        setUser,
        getSession,
        trackAuthChanges
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}