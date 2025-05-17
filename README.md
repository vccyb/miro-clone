


          
# Miro Clone

## 项目概述

这是一个基于 Vue 3 和 Supabase 构建的 Miro 白板协作工具克隆项目。该应用允许用户创建、编辑和共享交互式白板，支持团队协作，并提供丰富的绘图和文本编辑功能。

## 功能特点

- **用户认证系统**：支持邮箱密码注册/登录以及 OAuth 第三方登录（Google、GitHub）
- **白板编辑**：创建和编辑交互式白板，支持多种元素类型
- **团队协作**：创建团队并邀请成员共同编辑白板
- **实时同步**：基于 Supabase 实时数据库的协作编辑
- **个性化设置**：用户个人资料和偏好设置
- **响应式设计**：适配不同设备屏幕尺寸

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **UI 组件库**：Naive UI
- **样式解决方案**：Tailwind CSS
- **后端服务**：Supabase（认证、数据库、存储）
- **图标库**：Iconify

## 安装与设置

### 前提条件

- Node.js 16+
- pnpm 8+
- Supabase 账号（用于后端服务）

### 环境变量配置

在项目根目录创建 `.env` 文件，参考 `.env.example` 添加以下配置：

```
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 安装依赖

```sh
pnpm install
```

### 本地开发

```sh
pnpm dev
```

### 构建生产版本

```sh
pnpm build
```

## 数据库设置

项目使用 Supabase 作为后端服务，包含以下主要数据表：

- `profiles`：用户个人资料
- `boards`：白板数据
- `teams`：团队信息
- `team_members`：团队成员关系

### 初始化数据库

```sh
# 链接到你的 Supabase 项目
pnpm supabase:link --project-ref 你的项目ID

# 运行迁移脚本
pnpm db:reset
```

### 生成 TypeScript 类型

```sh
pnpm supabase:types
```

## 项目结构

```
src/
├── assets/         # 静态资源
├── components/     # 组件
│   ├── BoardActions/ # 白板操作相关组件
│   ├── Layout/     # 布局组件
│   └── board/      # 白板元素组件
├── composables/    # 组合式函数
├── lib/            # 库文件
├── pages/          # 页面组件
├── router/         # 路由配置
├── service/        # API 服务
├── stores/         # Pinia 状态管理
├── types/          # TypeScript 类型定义
└── utils/          # 工具函数
```

## 主要功能模块

### 认证系统

支持多种登录方式，包括：
- 邮箱密码注册/登录
- Google OAuth 登录
- GitHub OAuth 登录

### 白板编辑器

- 支持多种元素：文本、便签、形状、自由绘图等
- 元素操作：移动、调整大小、删除
- 画布操作：缩放、平移

### 团队管理

- 创建和管理团队
- 邀请成员加入团队
- 团队内白板共享与协作

## 开发指南

### 添加新的白板元素

1. 在 `src/types/canvas.ts` 中定义新元素类型
2. 在 `src/components/board/` 目录下创建对应的组件
3. 在 `src/stores/canvas.ts` 中添加相关状态和方法

### 扩展认证功能

认证相关逻辑位于 `src/service/auth/` 和 `src/stores/auth.ts`，可以在此基础上扩展更多认证方式或功能。

## 测试

```sh
# 运行单元测试
pnpm test:unit
```

## 代码规范

```sh
# 运行代码检查
pnpm lint

# 格式化代码
pnpm format
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

[MIT License](LICENSE)

## 致谢

- [Vue.js](https://vuejs.org/)
- [Supabase](https://supabase.io/)
- [Naive UI](https://www.naiveui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
