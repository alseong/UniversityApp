import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { buildEmailContent, resolveRecipientEmail } from "./index.ts";

Deno.test("buildEmailContent - reply_to_comment has correct subject", () => {
  const { subject } = buildEmailContent("reply_to_comment", "sub-123", "https://example.com");
  assertEquals(subject, "Someone replied to your comment");
});

Deno.test("buildEmailContent - reply_to_comment links to submission", () => {
  const { html } = buildEmailContent("reply_to_comment", "sub-123", "https://example.com");
  assertStringIncludes(html, "https://example.com/submissions/sub-123");
});

Deno.test("buildEmailContent - comment_on_submission has correct subject", () => {
  const { subject } = buildEmailContent("comment_on_submission", "sub-456", "https://example.com");
  assertEquals(subject, "New comment on your submission");
});

Deno.test("buildEmailContent - comment_on_submission links to submission", () => {
  const { html } = buildEmailContent("comment_on_submission", "sub-456", "https://example.com");
  assertStringIncludes(html, "https://example.com/submission/sub-456");
});

Deno.test("resolveRecipientEmail - returns override when set", () => {
  const result = resolveRecipientEmail("real@user.com", "test@gmail.com");
  assertEquals(result, "test@gmail.com");
});

Deno.test("resolveRecipientEmail - returns actual email when no override", () => {
  const result = resolveRecipientEmail("real@user.com", undefined);
  assertEquals(result, "real@user.com");
});
