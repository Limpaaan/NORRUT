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
 data jsonb not null default '{"version":1,"coins":0,"best":0,"runs":0,"levels":{"engine":0,"tank":0,"wings":0}}',
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
 if jsonb_typeof(next_data) <> 'object' or (next_data->>'version') is distinct from '1'
 or not (next_data ?& array['coins','best','runs','levels']) then raise exception 'invalid save'; end if;
 if not (next_data->'levels' ?& array['engine','tank','wings']) then raise exception 'invalid levels'; end if;
 if exists(select 1 from jsonb_each(next_data) kv where kv.key in ('coins','best','runs') and (jsonb_typeof(kv.value)<>'number' or kv.value::text !~ '^[0-9]{1,12}$')) then raise exception 'invalid values'; end if;
 if exists(select 1 from jsonb_each(next_data->'levels') kv where kv.key in ('engine','tank','wings') and (jsonb_typeof(kv.value)<>'number' or kv.value::text !~ '^([0-9]|1[0-9]|20)$')) then raise exception 'invalid levels'; end if;
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
