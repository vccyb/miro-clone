import { faker } from '@faker-js/faker/locale/zh_CN'
import { supabase } from '@/lib/supabaseClient'

const TOTAL_BOARDS = 10
const TOTAL_USERS = 10
const TOTAL_TEAMS = 10

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

/**
 * 生成随机用户
 * @returns 生成的用户数据
 */
export const generateUsers = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('需要登录才能生成测试数据')
    }

    const users = []
    
    for (let i = 0; i < TOTAL_USERS; i++) {
        const email = faker.internet.email()
        const password = 'Password123!' // 使用固定密码方便测试
        const username = faker.internet.userName()
        const fullName = faker.person.fullName()
        
        // 创建用户
        const { data: userData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    full_name: fullName
                }
            }
        })
        
        if (signUpError) {
            console.error('创建用户失败:', signUpError)
            continue
        }
        
        // 创建用户资料
        if (userData.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: userData.user.id,
                username,
                full_name: fullName,
                bio: faker.person.bio(),
                avatar_url: faker.image.avatar()
            })
            
            if (profileError) {
                console.error('创建用户资料失败:', profileError)
            } else {
                users.push(userData.user)
            }
        }
    }

    return users
}

/**
 * 生成团队测试数据
 * @returns 生成的团队数据
 */
export const generateTeams = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('需要登录才能生成测试数据')
    }

    // 获取所有用户ID用于添加团队成员
    const { data: profiles } = await supabase.from('profiles').select('id')
    const userIds = profiles ? profiles.map(profile => profile.id) : []
    
    if (userIds.length === 0) {
        throw new Error('没有可用的用户来创建团队，请先创建用户')
    }

    // 生成团队数据
    const teams = Array.from({ length: TOTAL_TEAMS }, () => ({
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        logo_url: faker.image.urlLoremFlickr({ category: 'business' }),
        owner_id: user.id
    }))

    // 插入团队数据
    const { data, error } = await supabase.from('teams').insert(teams).select()

    if (error) {
        throw new Error(`生成团队测试数据失败: ${error.message}`)
    }

    // 为每个团队添加一些成员（注意：团队创建者已经通过触发器自动添加为成员）
    if (data && data.length > 0) {
        // 为每个团队随机添加1-5个成员
        const teamMembers = data.flatMap(team => {
            // 过滤掉团队所有者，避免重复添加
            const availableUsers = userIds.filter(id => id !== user.id)
            
            if (availableUsers.length === 0) return []
            
            const memberCount = Math.min(Math.floor(Math.random() * 5) + 1, availableUsers.length)
            const selectedUsers = [...availableUsers]
                .sort(() => 0.5 - Math.random())
                .slice(0, memberCount)
            
            return selectedUsers.map(userId => ({
                team_id: team.id,
                user_id: userId,
                role: Math.random() > 0.7 ? 'admin' : 'member' // 30%的概率成为管理员
            }))
        })

        // 插入团队成员数据
        if (teamMembers.length > 0) {
            const { error: memberError } = await supabase.from('team_members').insert(teamMembers)
            if (memberError) {
                console.error('添加团队成员失败:', memberError)
            }
        }
    }

    return data
}