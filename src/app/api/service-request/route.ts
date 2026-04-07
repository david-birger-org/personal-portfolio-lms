import { after, NextResponse } from "next/server";

import { serviceRequestSchema } from "@/lib/contact-form/schema";
import { POSTHOG_EVENTS } from "@/lib/posthog-events";
import {
  captureServerEvent,
  getPostHogDistinctId,
  getPostHogRequestContext,
} from "@/lib/posthog-server";
import { sendTransactionalMail } from "@/lib/server/lms-sls-client";
import {
  applyRetryAfterHeader,
  consumeRateLimit,
  getRateLimitKey,
  isHoneypotTriggered,
} from "@/lib/server/request-security";

export async function POST(request: Request) {
  const posthogContext = getPostHogRequestContext(request);
  const rateLimit = consumeRateLimit({
    key: getRateLimitKey(request, "service-request"),
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

  const parsed = serviceRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid service request payload" },
      { status: 400 },
    );
  }

  const { service, name, email, phone } = parsed.data;

  const subject = `New Service Request: ${service}`;

  const text = [
    "New service request submitted",
    "",
    `Service: ${service}`,
    `Name: ${name}`,
    `Email: ${email || "-"}`,
    `Phone: ${phone || "-"}`,
  ].join("\n");

  const result = await sendTransactionalMail({
    subject,
    text,
    replyTo: email,
  });

  if (result.ok) {
    after(() =>
      captureServerEvent({
        distinctId: getPostHogDistinctId(
          posthogContext.distinctId,
          email,
          phone,
        ),
        event: POSTHOG_EVENTS.serviceRequestSubmitted,
        properties: {
          ...(posthogContext.properties ?? {}),
          service,
          has_email: Boolean(email),
          has_phone: Boolean(phone),
        },
      }),
    );

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

  console.error("Failed to send service request email", result.error);
  return NextResponse.json(
    { error: "Failed to send service request" },
    { status: 502 },
  );
}
