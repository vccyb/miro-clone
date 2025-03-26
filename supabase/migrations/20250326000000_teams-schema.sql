-- 创建团队表
create table
  teams (
    id uuid default gen_random_uuid() not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    name text not null,
    description text default null,
    logo_url text default null,
    owner_id uuid references auth.users on delete cascade not null,
    
    primary key (id)
  );

-- 创建团队成员关系表
create table
  team_members (
    id uuid default gen_random_uuid() not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    team_id uuid references teams on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    role text default 'member' not null, -- 'owner', 'admin', 'member'
    
    primary key (id),
    unique (team_id, user_id)
  );

-- 创建更新触发器，自动更新updated_at字段
create or replace function update_teams_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_teams_updated_at
before update on teams
for each row
execute function update_teams_updated_at_column();

create trigger update_team_members_updated_at
before update on team_members
for each row
execute function update_teams_updated_at_column();

-- 创建RLS策略
alter table teams enable row level security;
alter table team_members enable row level security;

-- 团队表的RLS策略
-- 1. 任何人都可以查看团队信息
create policy "任何人可以查看团队信息"
on teams for select
to authenticated
using (true);

-- 2. 只有团队所有者可以更新团队信息
create policy "只有团队所有者可以更新团队信息"
on teams for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- 3. 只有团队所有者可以删除团队
create policy "只有团队所有者可以删除团队"
on teams for delete
to authenticated
using (auth.uid() = owner_id);

-- 4. 任何认证用户都可以创建团队
create policy "认证用户可以创建团队"
on teams for insert
to authenticated
with check (auth.uid() = owner_id);

-- 团队成员表的RLS策略
-- 1. 团队成员可以查看自己所在团队的成员列表
create policy "团队成员可以查看成员列表"
on team_members for select
to authenticated
using (
  exists (
    select 1 from team_members
    where team_id = team_members.team_id
    and user_id = auth.uid()
  )
);

-- 2. 只有团队所有者可以添加成员（简化策略，避免递归）
create policy "团队所有者可以添加成员"
on team_members for insert
to authenticated
with check (
  exists (
    select 1 from teams
    where id = team_id
    and owner_id = auth.uid()
  )
);

-- 3. 只有团队所有者可以更新成员信息（简化策略，避免递归）
create policy "团队所有者可以更新成员信息"
on team_members for update
to authenticated
using (
  exists (
    select 1 from teams
    where id = team_members.team_id
    and owner_id = auth.uid()
  )
);

-- 4. 只有团队所有者可以删除成员（简化策略，避免递归）
create policy "团队所有者可以删除成员"
on team_members for delete
to authenticated
using (
  exists (
    select 1 from teams
    where id = team_members.team_id
    and owner_id = auth.uid()
  )
);

-- 添加触发器，确保团队创建时自动将创建者添加为成员
create or replace function add_team_owner_as_member()
returns trigger as $$
begin
  insert into team_members (team_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$ language plpgsql;

create trigger add_team_owner_trigger
after insert on teams
for each row
execute function add_team_owner_as_member();

-- 添加触发器，防止删除团队所有者的成员记录
create or replace function prevent_owner_removal()
returns trigger as $$
begin
  if old.role = 'owner' then
    raise exception 'Cannot remove team owner from members';
  end if;
  return old;
end;
$$ language plpgsql;

create trigger prevent_owner_removal_trigger
before delete on team_members
for each row
execute function prevent_owner_removal();

-- 添加触发器，防止降级团队所有者的角色
create or replace function prevent_owner_role_change()
returns trigger as $$
begin
  if old.role = 'owner' and new.role != 'owner' then
    raise exception 'Cannot change role of team owner';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger prevent_owner_role_change_trigger
before update on team_members
for each row
execute function prevent_owner_role_change();

-- 更新boards表的外键引用
alter table boards 
  add constraint boards_team_id_fkey 
  foreign key (team_id) 
  references teams(id) 
  on delete set null;

-- 更新白板表的RLS策略，允许团队成员访问团队白板
create policy "团队成员可以查看团队白板"
on boards for select
to authenticated
using (
  team_id is null 
  or 
  exists (
    select 1 from team_members
    where team_id = boards.team_id
    and user_id = auth.uid()
  )
);

-- 更新白板表的RLS策略，允许团队成员更新团队白板
create policy "团队成员可以更新团队白板"
on boards for update
to authenticated
using (
  auth.uid() = author_id
  or
  exists (
    select 1 from team_members
    where team_id = boards.team_id
    and user_id = auth.uid()
    and role in ('owner', 'admin')
  )
);

-- 更新白板表的RLS策略，允许团队成员删除团队白板
create policy "团队成员可以删除团队白板"
on boards for delete
to authenticated
using (
  auth.uid() = author_id
  or
  exists (
    select 1 from team_members
    where team_id = boards.team_id
    and user_id = auth.uid()
    and role in ('owner', 'admin')
  )
);