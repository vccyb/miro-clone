import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './auth'

export interface Team {
    id: string
    name: string
    description: string | null
    logo_url: string | null
    owner_id: string
    created_at: string
    updated_at: string
}

export const useTeamStore = defineStore('team-store', () => {
    const teams = ref<Team[]>([])
    const currentTeamId = ref<string | null>(null)
    const isLoading = ref(false)

    // 计算属性：当前选中的团队
    const currentTeam = computed(() => {
        if (!currentTeamId.value) return null
        return teams.value.find(team => team.id === currentTeamId.value) || null
    })

    // 加载用户的所有团队
    const loadUserTeams = async () => {
        const authStore = useAuthStore()
        if (!authStore.user) return []

        isLoading.value = true
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('team_id, teams(*)')
                .eq('user_id', authStore.user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('获取用户团队列表失败:', error)
                return []
            }

            // 提取团队数据
            teams.value = data.map(item => item.teams) as Team[]
            
            // 如果有团队且没有选中的团队，默认选择第一个
            if (teams.value.length > 0 && !currentTeamId.value) {
                currentTeamId.value = teams.value[0].id
            }
            
            return teams.value
        } catch (error) {
            console.error('加载团队失败:', error)
            return []
        } finally {
            isLoading.value = false
        }
    }

    // 设置当前团队
    const setCurrentTeam = (teamId: string | null) => {
        currentTeamId.value = teamId
    }

    // 创建新团队
    const addTeam = async (name: string, description?: string) => {
        const authStore = useAuthStore()
        if (!authStore.user) return null

        isLoading.value = true
        try {
            const { data, error } = await supabase
                .from('teams')
                .insert({
                    name,
                    description,
                    owner_id: authStore.user.id
                })
                .select()
                .single()

            if (error) {
                console.error('创建团队失败:', error)
                return null
            }

            teams.value.unshift(data as Team)
            currentTeamId.value = data.id
            return data as Team
        } catch (error) {
            console.error('创建团队失败:', error)
            return null
        } finally {
            isLoading.value = false
        }
    }

    return {
        teams,
        currentTeamId,
        currentTeam,
        isLoading,
        loadUserTeams,
        setCurrentTeam,
        addTeam
    }
})