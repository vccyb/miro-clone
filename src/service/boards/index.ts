import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/stores/auth";
import type { Database } from "../../../database/types";

export type Board = Database['public']['Tables']['boards']['Row']
export type InsertBoard = Database['public']['Tables']['boards']['Insert'];
export type UpdateBoard = Database['public']['Tables']['boards']['Update'];
/**
 * 获取当前用户所有的board
 */
export const getAllBoards = async (): Promise<Board[]> => {
    const authStore = useAuthStore()
    if (!authStore.user) return []
    const { data, error } = await supabase.from('boards')
        .select('*')
        .eq('author_id', authStore.user.id)
        .order('updated_at', {
            ascending: false
        })

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
 * 创建白板
 */
export const createBoard = async (title: string): Promise<Board | null> => {
    const authStore = useAuthStore()
    if (!authStore.user) return null
    const randomImageNumber = Math.floor(Math.random() * 10) + 1
    const imageUrl = `/images/board-previews/${randomImageNumber}.svg`
    const newBoard: InsertBoard = {
        title,
        author_id: authStore.user.id,
        author_name: authStore.user.user_metadata.username || authStore.user.email || '未知用户',
        image_url: imageUrl
    }

    const { data, error } = await supabase.from('boards')
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