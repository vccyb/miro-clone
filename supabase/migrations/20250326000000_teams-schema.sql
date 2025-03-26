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

