-- Sprintiverse owner profile and trial settings support
alter table public.profiles add column if not exists name_last_changed_at timestamptz;

create or replace function public.update_owner_profile_name(w uuid, new_name text)
returns public.profiles
language plpgsql
security definer
set search_path=public
as $$
declare r public.profiles;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.is_workspace_owner(w, auth.uid()) then raise exception 'not authorized'; end if;
  if char_length(trim(new_name)) < 2 or char_length(trim(new_name)) > 80 then raise exception 'name must be between 2 and 80 characters'; end if;
  if exists(select 1 from public.profiles where id=auth.uid() and name_last_changed_at is not null and name_last_changed_at > now()-interval '7 days') then
    raise exception 'owner name can only be changed once every 7 days';
  end if;
  update public.profiles set full_name=trim(new_name), name_last_changed_at=now(), updated_at=now() where id=auth.uid() returning * into r;
  update auth.users set raw_user_meta_data=coalesce(raw_user_meta_data,'{}'::jsonb)||jsonb_build_object('full_name',trim(new_name)) where id=auth.uid();
  return r;
end;
$$;

grant execute on function public.update_owner_profile_name(uuid,text) to authenticated;

create or replace function public.get_workspace_billing(w uuid)
returns public.workspaces
language plpgsql
security definer
set search_path=public
as $$
declare r public.workspaces;
begin
  if not public.is_workspace_member(w,auth.uid()) then raise exception 'not authorized'; end if;
  perform public.enforce_trial_state(w);
  select * into r from public.workspaces where id=w;
  return r;
end;
$$;

grant execute on function public.get_workspace_billing(uuid) to authenticated;
