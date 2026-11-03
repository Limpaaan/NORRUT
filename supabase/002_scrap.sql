create table public.scrap_offers(id text primary key, window_id bigint not null, product text not null, condition integer not null check(condition between 0 and 6), mod text not null, price bigint not null, sold_to uuid references auth.users(id));
alter table public.scrap_offers enable row level security;
revoke all on public.scrap_offers from anon,authenticated;
create table norrut_private.product_catalog(id text primary key,slot text not null,tier integer not null,price bigint not null);
alter table norrut_private.product_catalog enable row level security;
create function norrut_private.scrap_stock() returns jsonb language plpgsql security definer set search_path='' as $$
declare w bigint:=floor(extract(epoch from now())/1800);i integer;p record;q integer;v jsonb;
begin
 if auth.uid() is null then raise exception 'Logga in först';end if;
 perform pg_advisory_xact_lock(74001);
 if not exists(select 1 from public.scrap_offers where window_id=w) then
 for i in 1..(select count(*)::integer from norrut_private.product_catalog) loop
 select * into p from norrut_private.product_catalog order by tier,slot offset (i-1) limit 1;
 q:=least(6,floor(ln(greatest(.0000001,random()))/ln(.3))::integer);
 insert into public.scrap_offers values(w::text||'-'||i,w,p.id,q,case when random()<.2 then 'hobby' when random()<.15 then 'overclock' else 'standard' end,greatest(1,floor(p.price*(.08+q*.055))),null);
 end loop;
 end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'product',product,'condition',condition,'mod',mod,'price',price)),'[]') into v from public.scrap_offers where window_id=w and sold_to is null;
 return v;
end;$$;
create function norrut_private.scrap_action(offer_id text,category text) returns text language plpgsql security definer set search_path='' as $$
declare d jsonb;g jsonb;o record;p record;item jsonb;cap integer;balance numeric;search_cost numeric;roll double precision;q integer;message text;arr text[];better boolean;money numeric;
begin
 if auth.uid() is null then raise exception 'Logga in först';end if;
 select data into d from public.player_saves where user_id=auth.uid() for update;
 if d is null then raise exception 'Sparning saknas';end if;
 g:=d->'gear';if g is null then raise exception 'Öppna Butiken först';end if;balance:=(d->>'coins')::numeric;
 if offer_id is not null then
  select * into o from public.scrap_offers where id=offer_id for update;
  if o is null or o.sold_to is not null or o.window_id<>floor(extract(epoch from now())/1800) then raise exception 'Delen är såld eller lagret har bytts';end if;
  select * into p from norrut_private.product_catalog where id=o.product;
  select coalesce(max(c.tier),0)+1 into cap from jsonb_array_elements(g->'items') a join norrut_private.product_catalog c on c.id=a->>'product' where a->>'id'=g->'mounted'->>p.slot;
  if p.tier>cap or balance<o.price then raise exception 'Låst steg eller för lite pengar';end if;
  balance:=balance-o.price;item:=jsonb_build_object('id',gen_random_uuid(),'product',p.id,'condition',o.condition,'mod',o.mod,'source','scrap','level',0);
  update public.scrap_offers set sold_to=auth.uid() where id=offer_id;message:='Delen finns nu under Montering.';
 else
  if category not in ('drive','aero','electronics') then raise exception 'Ogiltig kategori';end if;
  arr:=case when category='electronics' then array['instruments'] when category='drive' then array['engine','rockets','tank'] else array['wings','chassis','tail','nose'] end;
  select coalesce(max(c.tier),0)+1 into cap from jsonb_array_elements(g->'items') a join norrut_private.product_catalog c on c.id=a->>'product' where c.slot=any(arr) and a->>'id'=g->'mounted'->>c.slot;
  select greatest(5,round(5+price*.018)) into search_cost from norrut_private.product_catalog where id='engine-'||greatest(1,least(15,cap-1));
  if balance<search_cost then raise exception 'För lite pengar';end if;balance:=balance-search_cost;roll:=random();message:='Ingenting den här gången.';
  if roll>=.35 and roll<.70 then
   money:=ceil(search_cost*.3)+floor(random()*(greatest(0,floor(search_cost*.85)-ceil(search_cost*.3))+1));balance:=balance+money;message:='Du hittade '||money::text||' skrotmynt.';
  elsif roll>=.70 then
   better:=roll>=.90;
   select c.* into p from norrut_private.product_catalog c where c.slot=any(arr) and c.tier<=least(15,cap) and c.tier<=1+coalesce((select max(c2.tier) from jsonb_array_elements(g->'items') a join norrut_private.product_catalog c2 on c2.id=a->>'product' where a->>'id'=g->'mounted'->>c.slot),0) order by case when better then -c.tier else 0 end,random() limit 1;
   if better then q:=least(6,4+floor(ln(greatest(.0000001,random()))/ln(.2))::integer);else q:=least(6,floor(ln(greatest(.0000001,random()))/ln(.3))::integer);end if;
   item:=jsonb_build_object('id',gen_random_uuid(),'product',p.id,'condition',q,'mod',case when random()<.2 then 'hobby' when random()<.15 then 'overclock' else 'standard' end,'source','find','level',0);message:=case when better then 'Du hittade en bättre variant! Se Montering.' else 'Du hittade en del! Se Montering.' end;
  end if;
 end if;
 if item is not null then g:=jsonb_set(g,'{items}',(g->'items')||jsonb_build_array(item));end if;
 d:=jsonb_set(jsonb_set(d,'{gear}',g),'{coins}',to_jsonb(balance));update public.player_saves set data=d,revision=revision+1 where user_id=auth.uid();return message;
end;$$;

revoke all on function norrut_private.scrap_stock(),norrut_private.scrap_action(text,text) from public,anon;
grant execute on function norrut_private.scrap_stock(),norrut_private.scrap_action(text,text) to authenticated;
create function public.scrap_stock() returns jsonb language sql security invoker set search_path='' as $$select norrut_private.scrap_stock()$$;
create function public.scrap_buy(offer_id text) returns text language sql security invoker set search_path='' as $$select norrut_private.scrap_action(offer_id,null)$$;
create function public.scrap_search(category text) returns text language sql security invoker set search_path='' as $$select norrut_private.scrap_action(null,category)$$;
revoke all on function public.scrap_stock(),public.scrap_buy(text),public.scrap_search(text) from public,anon;
grant execute on function public.scrap_stock(),public.scrap_buy(text),public.scrap_search(text) to authenticated;
create index scrap_offers_window_idx on public.scrap_offers(window_id);
create index scrap_offers_sold_to_idx on public.scrap_offers(sold_to);
create policy scrap_no_direct_read on public.scrap_offers for select to authenticated using(false);
create policy catalog_no_direct_read on norrut_private.product_catalog for select to authenticated using(false);
