export const COUNTRY_CODES = ["UA", "US", "PL", "DE"] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export const CONTACT_COUNTRIES = [
  { code: COUNTRY_CODES[0], dialCode: "+380", labelKey: "ua" },
  { code: COUNTRY_CODES[1], dialCode: "+1", labelKey: "us" },
  { code: COUNTRY_CODES[2], dialCode: "+48", labelKey: "pl" },
  { code: COUNTRY_CODES[3], dialCode: "+49", labelKey: "de" },
] as const;

export const CONTACT_METHODS = [
  "whatsapp",
  "instagram",
  "telegram",
  "phoneCall",
] as const;

export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const SOCIAL_HANDLE_PATTERN = /^@?[a-zA-Z0-9._]{2,32}$/;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isPhoneValid(value: string) {
  const digits = value.trim().replace(/\D/g, "");
  return digits.length >= 7;
}
