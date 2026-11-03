create or replace function norrut_private.create_player() returns trigger language plpgsql security definer set search_path='' as $$
declare chosen text;
begin
 chosen:=new.raw_user_meta_data->>'username';
 if chosen is null or chosen !~ '^[A-Za-z0-9_]{3,24}$' then chosen:='Pilot_'||replace(new.id::text,'-','');chosen:=left(chosen,24);end if;
 insert into public.player_profiles(user_id,username) values(new.id,chosen);
 insert into public.player_saves(user_id) values(new.id);
 return new;
end;$$;
create function norrut_private.set_username(username text) returns text language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Logga in först.';end if;
 if username is null or username !~ '^[A-Za-z0-9_]{3,24}$' then raise exception 'Använd 3–24 bokstäver, siffror eller understreck.';end if;
 update public.player_profiles set username=set_username.username where user_id=auth.uid();return username;
end;$$;
create function public.set_username(username text) returns text language sql security invoker set search_path='' as $$select norrut_private.set_username(username);$$;
revoke all on function norrut_private.set_username(text),public.set_username(text) from public,anon;
grant execute on function norrut_private.set_username(text),public.set_username(text) to authenticated;
