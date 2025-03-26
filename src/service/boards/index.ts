import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/stores/auth";
import type { Database } from "../../../database/types";

export type Board = Database['public']['Tables']['boards']['Row']
export type InsertBoard = Database['public']['Tables']['boards']['Insert'];
export type UpdateBoard = Database['public']['Tables']['boards']['Update'];

// 定义排序类型
export type SortOption = 'last-created' | 'last-modified' | 'name-asc' | 'name-desc';
// 定义所有者筛选类型
export type OwnerFilter = 'anyone' | 'me' | 'others';

// 定义查询参数接口
export interface BoardQueryParams {
    sortBy?: SortOption;
    owner?: OwnerFilter;
    filter?: string;
    search?: string; // 添加搜索参数
}

/**
 * 获取当前用户所有的board
 * @param params 查询参数，包含排序方式、筛选条件和搜索关键词
 */
export const getAllBoards = async (params: BoardQueryParams = {}): Promise<Board[]> => {
    const authStore = useAuthStore()
    if (!authStore.user) return []

    let query = supabase.from('boards').select('*')

    // 根据所有者筛选
    if (params.owner) {
        const currentUserId = authStore.user.id
        if (params.owner === 'me') {
            query = query.eq('author_id', currentUserId)
        } else if (params.owner === 'others') {
            query = query.neq('author_id', currentUserId)
        }
    }

    // 添加搜索条件
    if (params.search && params.search.trim() !== '') {
        // 使用 ilike 进行模糊搜索，% 表示任意字符
        query = query.ilike('title', `%${params.search.trim()}%`)
    }

    // 根据排序选项设置排序方式
    switch (params.sortBy) {
        case 'last-created':
            query = query.order('created_at', { ascending: false })
            break
        case 'last-modified':
            query = query.order('updated_at', { ascending: false })
            break
        case 'name-asc':
            query = query.order('title', { ascending: true })
            break
        case 'name-desc':
            query = query.order('title', { ascending: false })
            break
        default:
            query = query.order('updated_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
        console.error('获取用户白板列表失败:', error)
        return []
    }

    return data || []
}


/**
 * 基于白板id获取白板
 */

export const getBoardById = async (id: string): Promise<Board | null> => {
    const { data, error } = await supabase.from('boards')
        .select('*')
        .eq('id', id)
        .single()
    if (error) {
        console.error('获取白板失败:', error)
        return null
    }
    return data
}


/**
 * 创建新白板
 * @param title 白板标题
 * @returns 创建的白板对象
 */
export const createBoard = async (title: string = 'Untitled'): Promise<Board | null> => {
    const authStore = useAuthStore()
    if (!authStore.user) return null

    // 随机选择一个预览图（1-10）
    const randomPreview = Math.floor(Math.random() * 10) + 1

    const newBoard = {
        title,
        author_id: authStore.user.id,
        author_name: authStore.user.user_metadata?.name || authStore.user.email || 'Unknown',
        image_url: `/images/board-previews/${randomPreview}.svg`
    }

    const { data, error } = await supabase
        .from('boards')
        .insert(newBoard)
        .select()
        .single()

    if (error) {
        console.error('创建白板失败:', error)
        return null
    }

    return data
}


/**
 * 更新白板
 * 
 */

export const updateBoard = async (boardId: string, updateData: UpdateBoard): Promise<Board | null> => {
    const { data, error } = await supabase.from('boards')
        .update(updateData)
        .eq('id', boardId)
        .select()
        .single()
    if (error) {
        console.error('更新白板失败:', error)
        return null
    }
    return data
}


/**
 * 删除白板
 */
export const deleteBoard = async (boardId: string): Promise<boolean> => {
    const { error } = await supabase.from('boards')
        .delete()
        .eq('id', boardId)
    if (error) {
        console.error('删除白板失败:', error)
        return false
    }
    return true
}
