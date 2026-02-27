import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const DESTINATION_EMAIL =
  process.env.MAIL_SEND_TO ??
  process.env.SERVICE_REQUEST_TO ??
  "kohut9ra@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPhoneValid(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7;
}

const serviceRequestSchema = z
  .object({
    service: z.string().trim().min(2).max(200),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().max(200).optional().default(""),
    phone: z.string().trim().max(40).optional().default(""),
  })
  .superRefine((data, ctx) => {
    const hasEmail = data.email.length > 0;
    const hasPhone = data.phone.length > 0;

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email or phone is required",
      });
      return;
    }

    if (hasEmail && !EMAIL_PATTERN.test(data.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email",
        path: ["email"],
      });
    }

    if (hasPhone && !isPhoneValid(data.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone",
        path: ["phone"],
      });
    }
  });

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
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword =
    process.env.GMAIL_PASSWORD ?? process.env.GMAIL_APP_PASSWORD;
  const fromAddress = process.env.SMTP_FROM ?? gmailUser;

  if (!gmailUser || !gmailPassword || !fromAddress) {
    console.error(
      "GMAIL_USER/GMAIL_PASSWORD (or GMAIL_APP_PASSWORD) not configured",
    );
    return NextResponse.json(
      { error: "Email provider is not configured" },
      { status: 500 },
    );
  }

  const text = [
    "New service request submitted",
    "",
    `Service: ${service}`,
    `Name: ${name}`,
    `Email: ${email || "-"}`,
    `Phone: ${phone || "-"}`,
  ].join("\n");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: fromAddress,
      to: DESTINATION_EMAIL,
      subject,
      text,
      replyTo: email && EMAIL_PATTERN.test(email) ? email : undefined,
    });

    return NextResponse.json({ ok: true, destination: DESTINATION_EMAIL });
  } catch (error) {
    console.error("Failed to send service request email", error);

    return NextResponse.json(
      { error: "Failed to send service request" },
      { status: 502 },
    );
  }
}
