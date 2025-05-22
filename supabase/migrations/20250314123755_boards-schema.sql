-- 创建白板表

-- 创建白板表
create table
  boards (
    id uuid default gen_random_uuid() not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    title text not null,
    author_id uuid references auth.users on delete cascade not null,
    author_name text not null,
    image_url text default null,
    team_id uuid default null,
    content jsonb default '{}'::jsonb, -- 添加白板内容字段，使用JSONB类型
    
    primary key (id)
  );

-- 创建RLS策略
alter table boards enable row level security;

-- 创建更新触发器，自动更新updated_at字段
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_boards_updated_at
before update on boards
for each row
execute function update_updated_at_column();

-- 创建访问策略：用户可以查看所有白板
create policy "任何人可以查看白板"
  on boards for select
  using (true);

-- 创建插入策略：已认证用户可以创建白板
create policy "已认证用户可以创建白板"
  on boards for insert
  with check (auth.uid() = author_id);

-- 创建更新和删除策略：只有作者可以更新和删除自己的白板
create policy "作者可以更新自己的白板"
  on boards for update
  using (auth.uid() = author_id);

create policy "作者可以删除自己的白板"
  on boards for delete
  using (auth.uid() = author_id);