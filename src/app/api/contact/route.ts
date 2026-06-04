import { after, NextResponse } from "next/server";

import { contactPayloadSchema } from "@/lib/contact-form/schema";
import { POSTHOG_EVENTS } from "@/lib/posthog-events";
import {
  captureServerEvent,
  getPostHogDistinctId,
  getPostHogRequestContext,
} from "@/lib/posthog-server";
import {
  saveContactRequest,
  sendTransactionalMail,
} from "@/lib/server/lms-sls-client";
import {
  applyRetryAfterHeader,
  consumeRateLimit,
  getRateLimitKey,
  isHoneypotTriggered,
} from "@/lib/server/request-security";

export async function POST(request: Request) {
  const posthogContext = getPostHogRequestContext(request);
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

  const [saveResult, result] = await Promise.all([
    saveContactRequest({
      requestType: "contact",
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      country: payload.country,
      phone: payload.phone,
      preferredContactMethod: payload.preferredContactMethod,
      social: payload.social,
      message: payload.message,
    }),
    sendTransactionalMail({
      subject,
      text,
      replyTo: payload.email,
    }),
  ]);

  if (!saveResult.ok) {
    console.error("Failed to persist contact request", saveResult);
  }

  if (result.ok) {
    after(() =>
      captureServerEvent({
        distinctId: getPostHogDistinctId(
          posthogContext.distinctId,
          payload.email,
          payload.phone,
        ),
        event: POSTHOG_EVENTS.contactApiEmailSent,
        properties: {
          ...(posthogContext.properties ?? {}),
          country: payload.country,
          preferred_contact_method: payload.preferredContactMethod,
          has_phone: Boolean(payload.phone),
          has_social: Boolean(payload.social),
        },
      }),
    );

    return NextResponse.json({ ok: true });
  }

  if (result.reason === "missing_config") {
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
