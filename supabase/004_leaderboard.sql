-- Public scoreboard deliberately exposes usernames and solo records only.
create function norrut_private.get_leaderboard() returns table(username text,distance bigint,runs bigint) language sql stable security definer set search_path='' as $$
 select p.username,greatest(0,(s.data->>'best')::bigint) as distance,(s.data->>'runs')::bigint as runs
 from public.player_profiles p join public.player_saves s on s.user_id=p.user_id
 where (s.data->>'runs')::bigint>0
 order by (s.data->>'best')::bigint desc,lower(p.username) asc limit 50;
$$;
revoke all on function norrut_private.get_leaderboard() from public;
grant usage on schema norrut_private to anon;
grant execute on function norrut_private.get_leaderboard() to anon,authenticated;
create function public.get_leaderboard() returns table(username text,distance bigint,runs bigint) language sql stable security invoker set search_path='' as $$select * from norrut_private.get_leaderboard();$$;
revoke all on function public.get_leaderboard() from public;
grant execute on function public.get_leaderboard() to anon,authenticated;
