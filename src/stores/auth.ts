import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth-store', () => {
    const user = ref<null | User>()

    const isTrackingAuthChanges = ref(false)

    const setUser = (userSession: null | Session = null) => {
        if (!userSession) {
            user.value = null
            return
        }
        user.value = userSession.user
    }

    const getSession = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (data.session?.user) {
            await setUser(data.session)
        }
    }

    const trackAuthChanges = () => {
        if (isTrackingAuthChanges.value) return
        isTrackingAuthChanges.value = true
        supabase.auth.onAuthStateChange((event, session) => {
            setTimeout(async () => {
                await setUser(session)
            }, 0)
        })
    }

    return {
        user,
        setUser,
        getSession,
        trackAuthChanges
    }

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}   