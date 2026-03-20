create or replace function public.handle_new_notification()
returns trigger
language plpgsql
security definer
as $$
begin
  perform
    net.http_post(
      url := 'https://nzwumgfiulkftdldhtuk.supabase.co/functions/v1/send-notification-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'type', 'INSERT',
        'table', 'notifications',
        'record', row_to_json(NEW),
        'old_record', null
      )::jsonb
    );
  return new;
end;
$$;

create or replace trigger on_notification_insert
  after insert on public.notifications
  for each row execute function public.handle_new_notification();
