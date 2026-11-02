-- Apply once using the connected project. Do not store emails in public profiles.
create schema if not exists norrut_private;
revoke all on schema norrut_private from public,anon;
grant usage on schema norrut_private to authenticated;
create table public.player_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 username text not null check (username ~ '^[A-Za-z0-9_]{3,24}$')
);
create unique index player_profiles_username_unique on public.player_profiles(lower(username));
create table public.player_saves (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{"version":2,"coins":0,"best":0,"busBest":0,"runs":0,"levels":{"engine":0,"tank":0,"wings":0,"chassis":0,"ramp":0,"rockets":0,"efficiency":0,"steering":0,"reserve":0,"cargo":0,"lock":0,"return":0},"inventory":{"fuel":1,"turbo":1,"lift":1,"nitro":0,"light":0},"bus":{"reverse":0,"rocket":0,"weight":0,"leak":0,"horse":0,"compass":0,"magnet":0,"cough":0,"fika":0,"wind":0,"parachute":0,"krylbo":0},"tickets":1,"crates":1,"pending":null,"received":[],"history":[]}',
 revision bigint not null default 0
);
alter table public.player_profiles enable row level security;
alter table public.player_saves enable row level security;
grant select on public.player_profiles,public.player_saves to authenticated;
revoke all on public.player_profiles,public.player_saves from anon;
revoke insert,update,delete on public.player_profiles,public.player_saves from authenticated;
create policy profiles_read on public.player_profiles for select to authenticated using (true);
create policy saves_read_own on public.player_saves for select to authenticated using ((select auth.uid())=user_id);
create function norrut_private.create_player() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.player_profiles(user_id,username) values(new.id,new.raw_user_meta_data->>'username');
 insert into public.player_saves(user_id) values(new.id);
 return new;
end; $$;
create trigger on_norrut_user_created after insert on auth.users for each row execute function norrut_private.create_player();
create function norrut_private.save_progress(expected_revision bigint,next_data jsonb) returns bigint language plpgsql security definer set search_path='' as $$
declare next_revision bigint;
begin
 if auth.uid() is null then raise exception 'not authenticated'; end if;
 if jsonb_typeof(next_data) <> 'object' or (next_data->>'version') is distinct from '2'
 or not (next_data ?& array['coins','best','busBest','runs','levels','inventory','bus','tickets','crates','pending','received','history']) then raise exception 'invalid save'; end if;
 if not (next_data->'levels' ?& array['engine','tank','wings','chassis','ramp','rockets','efficiency','steering','reserve','cargo','lock','return']) then raise exception 'invalid levels'; end if;
 if exists(select 1 from jsonb_each(next_data) kv where kv.key in ('coins','best','busBest','runs','tickets','crates') and (jsonb_typeof(kv.value)<>'number' or kv.value::text !~ '^[0-9]{1,16}$')) then raise exception 'invalid values'; end if;
 if exists(select 1 from jsonb_each(next_data->'levels') kv where jsonb_typeof(kv.value)<>'number' or (kv.value::text)::numeric<0 or (kv.value::text)::numeric>20) then raise exception 'invalid levels'; end if;
 if jsonb_typeof(next_data->'inventory')<>'object' or jsonb_typeof(next_data->'bus')<>'object' or jsonb_typeof(next_data->'history')<>'array' or jsonb_typeof(next_data->'received')<>'array' then raise exception 'invalid inventory'; end if;
 update public.player_saves set data=next_data,revision=revision+1 where user_id=auth.uid() and revision=expected_revision returning revision into next_revision;
 if next_revision is null then raise exception 'save conflict'; end if;
 return next_revision;
end; $$;
revoke all on function norrut_private.create_player() from public,anon,authenticated;
revoke all on function norrut_private.save_progress(bigint,jsonb) from public,anon;
grant execute on function norrut_private.save_progress(bigint,jsonb) to authenticated;
create function public.save_progress(expected_revision bigint,next_data jsonb) returns bigint language sql security invoker set search_path='' as $$
 select norrut_private.save_progress(expected_revision,next_data);
$$;
revoke all on function public.save_progress(bigint,jsonb) from public,anon;
grant execute on function public.save_progress(bigint,jsonb) to authenticated;