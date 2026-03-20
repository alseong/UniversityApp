import { Resend } from "npm:resend";
import { createClient } from "npm:@supabase/supabase-js";

type NotificationRow = {
  id: string;
  recipient_id: string;
  actor_id: string;
  comment_id: string;
  submission_id: string;
  type: "comment_on_submission" | "reply_to_comment" | "new_reply_in_thread";
  is_read: boolean;
  created_at: string;
};

type WebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: NotificationRow;
  old_record: NotificationRow | null;
};

export type EmailContent = {
  subject: string;
  html: string;
};

export function buildEmailContent(
  notificationType: NotificationRow["type"],
  submissionId: string,
  appUrl: string
): EmailContent {
  const submissionUrl = `${appUrl}/submissions/${submissionId}`;

  const wrapper = (content: string) => `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:40px 24px;">
      <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <p style="margin:0 0 24px 0;font-size:20px;font-weight:700;color:#111827;">admit-me</p>
        ${content}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="margin:0;font-size:12px;color:#9ca3af;">You're receiving this because you have an account on admit-me.com</p>
      </div>
    </div>
  `;

  const linkButton = `<a href="${submissionUrl}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#2563eb;color:white;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View on admit-me →</a>`;

  if (notificationType === "reply_to_comment") {
    return {
      subject: "Someone replied to your comment",
      html: wrapper(`
        <h2 style="margin:0 0 8px 0;font-size:18px;color:#111827;">Someone replied to your comment</h2>
        <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">A new reply was posted on a thread you're part of. Head over to admit-me to see what they said.</p>
        ${linkButton}
      `),
    };
  }

  if (notificationType === "new_reply_in_thread") {
    return {
      subject: "New reply in a thread you're in",
      html: wrapper(`
        <h2 style="margin:0 0 8px 0;font-size:18px;color:#111827;">New reply in a thread you're in</h2>
        <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">Someone replied in a thread you've participated in. Head over to admit-me to see what they said.</p>
        ${linkButton}
      `),
    };
  }

  return {
    subject: "New comment on your submission",
    html: wrapper(`
      <h2 style="margin:0 0 8px 0;font-size:18px;color:#111827;">New comment on your submission</h2>
      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">Someone left a comment on your admission submission. Head over to admit-me to join the conversation.</p>
      ${linkButton}
    `),
  };
}

export function resolveRecipientEmail(
  actualEmail: string,
  testOverride: string | undefined
): string {
  return testOverride ?? actualEmail;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  try {
    const body = (await req.json()) as WebhookPayload;

    if (body.type !== "INSERT" || !body.record) {
      return new Response(JSON.stringify({ skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const notification = body.record;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(notification.recipient_id);

    if (userError || !userData.user?.email) {
      return new Response(
        JSON.stringify({ error: "Could not find recipient email" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const recipientEmail = resolveRecipientEmail(
      userData.user.email,
      Deno.env.get("TEST_RECIPIENT_OVERRIDE")
    );

    const appUrl = Deno.env.get("APP_URL") ?? "https://admit-me.com";
    const { subject, html } = buildEmailContent(
      notification.type,
      notification.submission_id,
      appUrl
    );

    const { data, error } = await resend.emails.send({
      from: "admit-me <notifications@admit-me.com>",
      to: recipientEmail,
      subject,
      html,
    });

    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
