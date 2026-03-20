-- Update handle_new_comment to also notify all other reply authors in the same thread.
--
-- Previous behaviour:
--   Top-level comment → submission owner (comment_on_submission)
--   Reply             → parent author (reply_to_comment)
--                     + submission owner if different (comment_on_submission)
--
-- New behaviour adds:
--   Reply             → all other existing reply authors in the same thread (new_reply_in_thread),
--                       excluding the actor and parent author (those are already handled above).
--                       Submission owner handled separately; gets comment_on_submission if not
--                       already covered as a thread participant.
--
-- Also adds new_reply_in_thread to the notifications.type check constraint.

-- Drop all existing check constraints on the type column (name may vary by env),
-- then add a single canonical one that includes the new type.
do $$
declare
  r record;
begin
  for r in (
    select conname
    from pg_constraint
    where conrelid = 'public.notifications'::regclass
      and contype  = 'c'
      and pg_get_constraintdef(oid) like '%type%'
  ) loop
    execute 'alter table public.notifications drop constraint ' || quote_ident(r.conname);
  end loop;
end;
$$;

alter table public.notifications
  add constraint notifications_type_check
  check (type in ('comment_on_submission', 'reply_to_comment', 'new_reply_in_thread', 'like_on_submission'));

create or replace function public.handle_new_comment()
returns trigger
language plpgsql
security definer
as $$
declare
  v_submission_owner uuid;
  v_parent_author    uuid;
begin
  select user_id into v_submission_owner
  from public.admissions_data where id = new.submission_id;

  if new.parent_id is null then
    if v_submission_owner is not null and v_submission_owner != new.user_id then
      insert into public.notifications(recipient_id, actor_id, comment_id, submission_id, type)
      values (v_submission_owner, new.user_id, new.id, new.submission_id, 'comment_on_submission');
    end if;

  else
    select user_id into v_parent_author
    from public.comments where id = new.parent_id;

    -- Notify direct parent comment author.
    if v_parent_author is not null and v_parent_author != new.user_id then
      insert into public.notifications(recipient_id, actor_id, comment_id, submission_id, type)
      values (v_parent_author, new.user_id, new.id, new.submission_id, 'reply_to_comment');
    end if;

    -- Notify all other existing reply authors in this thread.
    -- Excludes: actor, parent author (already notified).
    -- Submission owner is NOT excluded here — if they've replied in this thread they get
    -- new_reply_in_thread, and the NOT EXISTS check below will then skip the duplicate.
    insert into public.notifications(recipient_id, actor_id, comment_id, submission_id, type)
    select distinct c.user_id, new.user_id, new.id, new.submission_id, 'new_reply_in_thread'
    from public.comments c
    where c.parent_id = new.parent_id
      and c.id        != new.id
      and c.user_id   != new.user_id
      and (v_parent_author is null or c.user_id != v_parent_author);

    -- Notify submission owner if not already covered above.
    if v_submission_owner is not null
       and v_submission_owner != new.user_id
       and v_submission_owner is distinct from v_parent_author
       and not exists (
         select 1 from public.comments
         where parent_id = new.parent_id
           and user_id   = v_submission_owner
           and id        != new.id
       )
    then
      insert into public.notifications(recipient_id, actor_id, comment_id, submission_id, type)
      values (v_submission_owner, new.user_id, new.id, new.submission_id, 'comment_on_submission');
    end if;

  end if;

  return new;
end;
$$;

drop trigger if exists on_comment_insert on public.comments;
create trigger on_comment_insert
  after insert on public.comments
  for each row execute function public.handle_new_comment();
