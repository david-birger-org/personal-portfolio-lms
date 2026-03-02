import { z } from "zod";

import {
  CONTACT_METHODS,
  COUNTRY_CODES,
  EMAIL_PATTERN,
  isPhoneValid,
  SOCIAL_HANDLE_PATTERN,
} from "@/lib/contact-form/constants";

export const contactPayloadSchema = z
  .object({
    firstName: z.string().trim().min(1).max(120),
    lastName: z.string().trim().max(120).optional().default(""),
    email: z.string().trim().max(200).optional().default(""),
    country: z.enum(COUNTRY_CODES).optional().default(COUNTRY_CODES[0]),
    phone: z.string().trim().max(40).optional().default(""),
    preferredContactMethod: z
      .union([z.enum(CONTACT_METHODS), z.literal("")])
      .optional()
      .default(""),
    social: z.string().trim().max(64).optional().default(""),
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

    if (
      (data.preferredContactMethod === "instagram" ||
        data.preferredContactMethod === "telegram") &&
      !data.social
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Social handle is required",
        path: ["social"],
      });
    }

    if (data.social && !SOCIAL_HANDLE_PATTERN.test(data.social)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid social handle",
        path: ["social"],
      });
    }
  });

export type ContactPayload = z.infer<typeof contactPayloadSchema>;

export const serviceRequestSchema = z
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

export type ServiceRequestPayload = z.infer<typeof serviceRequestSchema>;
