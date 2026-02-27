import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const DESTINATION_EMAIL =
  process.env.MAIL_SEND_TO ??
  process.env.SERVICE_REQUEST_TO ??
  "kohut9ra@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPhoneValid(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7;
}

const contactPayloadSchema = z
  .object({
    firstName: z.string().trim().min(1).max(120),
    email: z.string().trim().max(200).optional().default(""),
    phone: z.string().trim().max(40).optional().default(""),
    message: z.string().trim().min(10).max(3000),
  })
  .superRefine((data, ctx) => {
    const hasEmail = data.email.length > 0;
    const hasPhone = data.phone.length > 0;

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email or phone is required",
      });
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
  const parsed = contactPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact payload" },
      { status: 400 },
    );
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword =
    process.env.GMAIL_PASSWORD ?? process.env.GMAIL_APP_PASSWORD;
  const fromAddress = process.env.SMTP_FROM ?? gmailUser;

  if (!gmailUser || !gmailPassword || !fromAddress) {
    return NextResponse.json(
      { error: "Email provider is not configured" },
      { status: 500 },
    );
  }

  const payload = parsed.data;
  const subject = "New Contact Form Submission";
  const text = [
    "New contact form submission",
    "",
    `Name: ${payload.firstName}`,
    `Email: ${payload.email || "-"}`,
    `Phone: ${payload.phone || "-"}`,
    "",
    "Message:",
    payload.message,
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
      replyTo:
        payload.email && EMAIL_PATTERN.test(payload.email)
          ? payload.email
          : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact form email", error);
    return NextResponse.json(
      { error: "Failed to send contact form" },
      { status: 502 },
    );
  }
}
