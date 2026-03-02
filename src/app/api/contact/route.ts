import { NextResponse } from "next/server";

import { contactPayloadSchema } from "@/lib/contact-form/schema";
import { sendTransactionalMail } from "@/lib/server/mailer";
import {
  applyRetryAfterHeader,
  consumeRateLimit,
  getRateLimitKey,
  isHoneypotTriggered,
} from "@/lib/server/request-security";

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit({
    key: getRateLimitKey(request, "contact"),
    maxRequests: 8,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return applyRetryAfterHeader(
      NextResponse.json({ error: "Too many requests" }, { status: 429 }),
      rateLimit.retryAfterSeconds,
    );
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact payload" },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const subject = "New Contact Form Submission";
  const text = [
    "New contact form submission",
    "",
    `Name: ${`${payload.firstName} ${payload.lastName}`.trim()}`,
    `Email: ${payload.email || "-"}`,
    `Country: ${payload.country || "-"}`,
    `Phone: ${payload.phone || "-"}`,
    `Preferred contact method: ${payload.preferredContactMethod || "-"}`,
    `Social handle: ${payload.social || "-"}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const result = await sendTransactionalMail({
    subject,
    text,
    replyTo: payload.email,
  });

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  if (
    result.reason === "missing_config" ||
    result.reason === "missing_destination"
  ) {
    return NextResponse.json(
      { error: "Email provider is not configured" },
      { status: 500 },
    );
  }

  console.error("Failed to send contact form email", result.error);
  return NextResponse.json(
    { error: "Failed to send contact form" },
    { status: 502 },
  );
}
