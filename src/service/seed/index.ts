import { faker } from '@faker-js/faker/locale/zh_CN'
import { supabase } from '@/lib/supabaseClient'

const TOTAL_BOARDS = 10

export const generateBoards = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('需要登录才能生成测试数据')
    }

    const boards = Array.from({ length: TOTAL_BOARDS }, () => ({
        title: faker.company.catchPhrase(),
        author_id: user.id,
        author_name: user.user_metadata?.username || user.email || '未知用户',
        image_url: `/images/board-previews/${Math.floor(Math.random() * 10) + 1}.svg`
    }))

    const { data, error } = await supabase.from('boards').insert(boards)

    if (error) {
        throw new Error('生成测试数据失败')
    }

    return data
}