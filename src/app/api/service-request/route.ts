import { NextResponse } from "next/server";
import { serviceRequestSchema } from "@/lib/contact-form/schema";
import { sendTransactionalMail } from "@/lib/server/mailer";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
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
    return NextResponse.json({ ok: true });
  }

  if (result.reason === "missing_config") {
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
