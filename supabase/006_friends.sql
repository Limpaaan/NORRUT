create table public.friendships (
 requester uuid not null references public.player_profiles(user_id) on delete cascade,
 recipient uuid not null references public.player_profiles(user_id) on delete cascade,
 accepted boolean not null default false,
 created_at timestamptz not null default now(),
 check(requester<>recipient), primary key(requester,recipient)
);
create unique index friendship_pair on public.friendships(least(requester,recipient),greatest(requester,recipient));
alter table public.friendships enable row level security;
revoke all on public.friendships from anon,authenticated;
grant select on public.friendships to authenticated;
create policy participants_read on public.friendships for select to authenticated using((select auth.uid()) in (requester,recipient));
create function norrut_private.friend_action(action text,target text default '') returns jsonb language plpgsql security definer set search_path='' as $$
declare me uuid:=auth.uid(); other uuid; result jsonb;
begin
 if me is null then raise exception 'Logga in för att använda vänlistan.'; end if;
 if action<>'list' then
 select user_id into other from public.player_profiles where lower(username)=lower(trim(target));
 if other is null or other=me then raise exception 'Spelaren finns inte eller är du själv.'; end if;
 if action='add' then
 insert into public.friendships(requester,recipient) values(me,other) on conflict do nothing;
 elsif action='accept' then
 update public.friendships set accepted=true where requester=other and recipient=me and not accepted;
 elsif action='remove' then
 delete from public.friendships where (requester=me and recipient=other) or (requester=other and recipient=me);
 else raise exception 'Ogiltig vänåtgärd.'; end if;
 end if;
 select coalesce(jsonb_agg(jsonb_build_object('username',p.username,'accepted',f.accepted,'incoming',f.recipient=me) order by lower(p.username)),'[]'::jsonb) into result
 from public.friendships f join public.player_profiles p on p.user_id=case when f.requester=me then f.recipient else f.requester end
 where me in(f.requester,f.recipient);
 return result;
end; $$;
create function public.friend_action(action text,target text default '') returns jsonb language sql security invoker set search_path='' as $$select norrut_private.friend_action(action,target);$$;
create function norrut_private.friends_leaderboard() returns table(username text,distance bigint,runs bigint) language plpgsql stable security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Logga in för att se vänners rekord.'; end if;
 return query select p.username,greatest(0,(s.data->>'best')::bigint),(s.data->>'runs')::bigint
 from public.player_profiles p join public.player_saves s on s.user_id=p.user_id
 where p.user_id=auth.uid() or exists(select 1 from public.friendships f where f.accepted and ((f.requester=auth.uid() and f.recipient=p.user_id) or(f.recipient=auth.uid() and f.requester=p.user_id)))
 order by greatest(0,(s.data->>'best')::bigint) desc,lower(p.username) asc;
end; $$;
create function public.friends_leaderboard() returns table(username text,distance bigint,runs bigint) language sql stable security invoker set search_path='' as $$select * from norrut_private.friends_leaderboard();$$;
revoke all on function norrut_private.friend_action(text,text),public.friend_action(text,text),norrut_private.friends_leaderboard(),public.friends_leaderboard() from public,anon;
grant execute on function norrut_private.friend_action(text,text),public.friend_action(text,text),norrut_private.friends_leaderboard(),public.friends_leaderboard() to authenticated;
