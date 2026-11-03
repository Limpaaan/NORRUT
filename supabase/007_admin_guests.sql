create table norrut_private.admin_members(user_id uuid primary key references auth.users(id) on delete cascade);
create table norrut_private.guest_players(id uuid primary key default gen_random_uuid(), secret_hash text not null unique, username text not null, stats jsonb not null default '{}', last_seen timestamptz not null default now());
create table norrut_private.guest_commands(seq bigint generated always as identity primary key,guest_id uuid not null references norrut_private.guest_players(id),kind text not null check(kind in('reset','grant')),amount bigint not null default 0);
alter table norrut_private.admin_members enable row level security;
alter table norrut_private.guest_players enable row level security;
alter table norrut_private.guest_commands enable row level security;
revoke all on norrut_private.admin_members,norrut_private.guest_players,norrut_private.guest_commands from public,anon,authenticated;
create policy no_direct_admin on norrut_private.admin_members for all using(false);
create policy no_direct_guest on norrut_private.guest_players for all using(false);
create policy no_direct_commands on norrut_private.guest_commands for all using(false);
alter table public.player_saves add column admin_revision bigint not null default 0;
create function norrut_private.is_admin() returns boolean language sql stable security definer set search_path='' as $$select auth.uid() is not null and exists(select 1 from norrut_private.admin_members where user_id=auth.uid());$$;
create function public.is_admin() returns boolean language sql stable security invoker set search_path='' as $$select norrut_private.is_admin();$$;
create function norrut_private.guest_sync(secret text,stats jsonb,after_seq bigint) returns jsonb language plpgsql security definer set search_path='' as $$
declare gid uuid; commands jsonb;
begin
 if secret !~ '^[a-f0-9]{64}$' or after_seq<0 then raise exception 'invalid guest'; end if;
 insert into norrut_private.guest_players(secret_hash,username) values(encode(extensions.digest(secret,'sha256'),'hex'),'Gäst_'||substr(encode(extensions.digest(secret,'sha256'),'hex'),1,8)) on conflict(secret_hash) do nothing;
 select id into gid from norrut_private.guest_players where secret_hash=encode(extensions.digest(secret,'sha256'),'hex') for update;
 update norrut_private.guest_players set stats=jsonb_build_object('coins',greatest(0,least(1000000000,coalesce((guest_sync.stats->>'coins')::bigint,0))),'best',greatest(0,least(500000,coalesce((guest_sync.stats->>'best')::bigint,0))),'runs',greatest(0,coalesce((guest_sync.stats->>'runs')::bigint,0))),last_seen=now() where id=gid;
 select coalesce(jsonb_agg(jsonb_build_object('seq',seq,'kind',kind,'amount',amount) order by seq),'[]') into commands from norrut_private.guest_commands where guest_id=gid and seq>after_seq;
 return commands;
end;$$;
create function public.guest_sync(secret text,stats jsonb,after_seq bigint) returns jsonb language sql security invoker set search_path='' as $$select norrut_private.guest_sync(secret,stats,after_seq);$$;
create function norrut_private.admin_players() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin if not norrut_private.is_admin() then raise exception 'Adminbehörighet krävs.'; end if;
 select coalesce(jsonb_agg(x order by x->>'username'),'[]') into result from (
 select jsonb_build_object('id',p.user_id,'username',p.username,'email',u.email,'kind','account','coins',s.data->'coins','best',s.data->'best','runs',s.data->'runs') x from public.player_profiles p join public.player_saves s on s.user_id=p.user_id join auth.users u on u.id=p.user_id
 union all select jsonb_build_object('id',id,'username',username,'email','','kind','guest','coins',stats->'coins','best',stats->'best','runs',stats->'runs') from norrut_private.guest_players) rows;
 return result;
end;$$;
create function public.admin_players() returns jsonb language sql stable security invoker set search_path='' as $$select norrut_private.admin_players();$$;
create function norrut_private.admin_adjust(player_id uuid,player_kind text,operation text,amount bigint default 0) returns text language plpgsql security definer set search_path='' as $$
declare initial jsonb;
begin
 if not norrut_private.is_admin() then raise exception 'Adminbehörighet krävs.'; end if;
 if operation not in ('reset','grant') or amount<0 or amount>1000000000 then raise exception 'Ogiltig ändring.'; end if;
 if player_kind='guest' then
 if not exists(select 1 from norrut_private.guest_players where id=player_id) then raise exception 'Spelaren saknas.'; end if;
 insert into norrut_private.guest_commands(guest_id,kind,amount) values(player_id,operation,amount);
 elsif player_kind='account' then
 if operation='reset' then
 select data into initial from public.player_saves where user_id=player_id;
 initial=jsonb_build_object('version',2,'coins',0,'best',0,'busBest',0,'runs',0,'tickets',1,'crates',1,'pending',null,'received','[]'::jsonb,'history','[]'::jsonb,'levels',(select jsonb_object_agg(key,0) from jsonb_each(initial->'levels')),'inventory','{"fuel":1,"turbo":1,"lift":1,"nitro":0,"light":0}'::jsonb,'bus',(select jsonb_object_agg(key,0) from jsonb_each(initial->'bus')),'achievements','[]'::jsonb);
 update public.player_saves set data=initial,revision=revision+1,admin_revision=revision+1 where user_id=player_id;
 else update public.player_saves set data=jsonb_set(data,'{coins}',to_jsonb(least(1000000000,(data->>'coins')::bigint+amount))),revision=revision+1,admin_revision=revision+1 where user_id=player_id;
 end if;
 else raise exception 'Ogiltig spelartyp.'; end if;
 return 'Ändringen är sparad. Gäster får ändringen vid nästa anslutning.';
end;$$;
create function public.admin_adjust(player_id uuid,player_kind text,operation text,amount bigint default 0) returns text language sql security invoker set search_path='' as $$select norrut_private.admin_adjust(player_id,player_kind,operation,amount);$$;
revoke all on function norrut_private.is_admin(),public.is_admin(),norrut_private.admin_players(),public.admin_players(),norrut_private.admin_adjust(uuid,text,text,bigint),public.admin_adjust(uuid,text,text,bigint) from public,anon;
grant execute on function norrut_private.is_admin(),public.is_admin(),norrut_private.admin_players(),public.admin_players(),norrut_private.admin_adjust(uuid,text,text,bigint),public.admin_adjust(uuid,text,text,bigint) to authenticated;
revoke all on function norrut_private.guest_sync(text,jsonb,bigint),public.guest_sync(text,jsonb,bigint) from public;
grant execute on function norrut_private.guest_sync(text,jsonb,bigint),public.guest_sync(text,jsonb,bigint) to anon,authenticated;
