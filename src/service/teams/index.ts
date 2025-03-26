import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'

export interface Team {
    id: string
    name: string
    description: string | null
    logo_url: string | null
    owner_id: string
    created_at: string
    updated_at: string
}

export interface TeamMember {
    id: string
    team_id: string
    user_id: string
    role: 'owner' | 'admin' | 'member'
    created_at: string
    updated_at: string
}

export interface CreateTeamData {
    name: string
    description?: string
    logo_url?: string
}

// 获取用户所有团队
export const getUserTeams = async (): Promise<Team[]> => {
    const authStore = useAuthStore()
    if (!authStore.user) return []

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
    return data.map(item => item.teams) as Team[]
}

// 创建新团队
export const createTeam = async (teamData: CreateTeamData): Promise<Team | null> => {
    const authStore = useAuthStore()
    if (!authStore.user) return null

    const { data, error } = await supabase
        .from('teams')
        .insert({
            ...teamData,
            owner_id: authStore.user.id
        })
        .select()
        .single()

    if (error) {
        console.error('创建团队失败:', error)
        return null
    }

    return data as Team
}

// 获取团队成员
export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('role', { ascending: true })

    if (error) {
        console.error('获取团队成员失败:', error)
        return []
    }

    return data as TeamMember[]
}