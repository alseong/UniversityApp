import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const EDGE_FUNCTION_URL =
  "https://nzwumgfiulkftdldhtuk.supabase.co/functions/v1/send-notification-email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function backfill() {
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;

  console.log(`Found ${notifications.length} notifications to process`);

  let success = 0;
  let failed = 0;

  for (const notification of notifications) {
    const res = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "INSERT",
        table: "notifications",
        record: notification,
        old_record: null,
      }),
    });

    if (res.ok) {
      console.log(`✓ ${notification.id} (${notification.type})`);
      success++;
    } else {
      const body = await res.json();
      console.error(`✗ ${notification.id}:`, body);
      failed++;
    }

    // small delay to avoid hitting Resend rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(`\nDone. ${success} sent, ${failed} failed.`);
}

backfill().catch(console.error);
