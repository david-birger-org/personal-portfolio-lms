"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_FORM_FIELD_ID, CONTACT_FORM_ID } from "@/constants/links";
import {
  CONTACT_COUNTRIES,
  type CountryCode,
  SOCIAL_HANDLE_PATTERN,
} from "@/lib/contact-form/constants";
import type { ContactPayload } from "@/lib/contact-form/schema";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: CountryCode;
  phone: string;
  preferredContactMethod: "" | ContactPayload["preferredContactMethod"];
  social: string;
  message: string;
  website: string;
}

const INITIAL_FORM_DATA: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  country: "UA",
  phone: "",
  preferredContactMethod: "",
  social: "",
  message: "",
  website: "",
};

type PhoneNumberParser = (
  phone: string,
  country?: CountryCode,
) =>
  | {
      isValid: () => boolean;
    }
  | undefined;

type ContactFormVariant = "full" | "compact";

interface ContactFormClientVariantProps {
  variant: ContactFormVariant;
}

export function ContactFormClient() {
  return <ContactFormClientVariant variant="full" />;
}

export function CompactContactFormClient() {
  return <ContactFormClientVariant variant="compact" />;
}

function ContactFormClientVariant({ variant }: ContactFormClientVariantProps) {
  const t = useTranslations("contact");
  const searchParams = useSearchParams();
  const selectedProgram = searchParams.get("program")?.trim() ?? "";
  const isCompact = variant === "compact";
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [selectedProgramMessage, setSelectedProgramMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const parsePhoneNumberRef = useRef<PhoneNumberParser | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const firstNameFieldRef = useRef<HTMLInputElement>(null);
  const hasProgramPrefill = selectedProgramMessage.length > 0;

  useEffect(() => {
    const idleScheduler = globalThis as typeof globalThis & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout?: number },
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const loadPhoneParser = () => {
      void import("libphonenumber-js/min")
        .then((module) => {
          parsePhoneNumberRef.current = module.parsePhoneNumberFromString;
        })
        .catch(() => {
          parsePhoneNumberRef.current = null;
        });
    };

    if (idleScheduler.requestIdleCallback && idleScheduler.cancelIdleCallback) {
      const idleId = idleScheduler.requestIdleCallback(loadPhoneParser, {
        timeout: 1200,
      });

      return () => {
        idleScheduler.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = window.setTimeout(loadPhoneParser, 300);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (
      hash !== `#${CONTACT_FORM_ID}` &&
      hash !== `#${CONTACT_FORM_FIELD_ID}`
    ) {
      return;
    }

    requestAnimationFrame(() => {
      const formContainer = formContainerRef.current;
      const firstNameField = firstNameFieldRef.current;
      if (!formContainer || !firstNameField) {
        return;
      }

      formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      firstNameField.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (!selectedProgram) {
      return;
    }

    const programMessage = `Hi David, I would like to discuss this program: ${selectedProgram}.`;
    setSelectedProgramMessage(programMessage);

    const url = new URL(window.location.href);
    url.searchParams.delete("program");
    const query = url.searchParams.toString();
    const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);

    requestAnimationFrame(() => {
      const formContainer = formContainerRef.current;
      const firstNameField = firstNameFieldRef.current;
      if (!formContainer || !firstNameField) {
        return;
      }

      formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      firstNameField.focus({ preventScroll: true });
    });
  }, [selectedProgram]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("form.validation.firstNameRequired");
    }

    if (!isCompact && !formData.lastName.trim()) {
      newErrors.lastName = t("form.validation.lastNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("form.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("form.validation.emailInvalid");
    }

    if (!isCompact && !formData.phone.trim()) {
      newErrors.phone = t("form.validation.phoneRequired");
    } else if (formData.phone.trim()) {
      try {
        const parsePhoneNumberFromString = parsePhoneNumberRef.current;
        if (parsePhoneNumberFromString) {
          const parsed = parsePhoneNumberFromString(
            formData.phone,
            formData.country,
          );

          if (!parsed?.isValid()) {
            newErrors.phone = t("form.validation.phoneInvalid");
          }
        } else {
          const digits = formData.phone.replace(/\D/g, "");
          if (digits.length < 8) {
            newErrors.phone = t("form.validation.phoneInvalid");
          }
        }
      } catch {
        const digits = formData.phone.replace(/\D/g, "");
        if (digits.length < 8) {
          newErrors.phone = t("form.validation.phoneInvalid");
        }
      }
    }

    if (!isCompact && !formData.preferredContactMethod.trim()) {
      newErrors.preferredContactMethod = t(
        "form.validation.preferredContactMethodRequired",
      );
    }

    if (
      ["instagram", "telegram"].includes(formData.preferredContactMethod) &&
      !formData.social.trim()
    ) {
      newErrors.social = t("form.validation.socialRequired");
    } else if (
      formData.social.trim() &&
      !SOCIAL_HANDLE_PATTERN.test(formData.social.trim())
    ) {
      newErrors.social = t("form.validation.socialInvalid");
    }

    if (!hasProgramPrefill) {
      if (!formData.message.trim()) {
        newErrors.message = t("form.validation.messageRequired");
      } else if (formData.message.trim().length < 10) {
        newErrors.message = t("form.validation.messageMinLength");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          country: formData.country,
          phone: formData.phone.trim(),
          preferredContactMethod: formData.preferredContactMethod,
          social: formData.social.trim(),
          message: hasProgramPrefill
            ? selectedProgramMessage
            : formData.message.trim(),
          website: formData.website,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      setIsSuccess(true);
      setFormData(INITIAL_FORM_DATA);

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch {
      setErrors({ form: t("form.validation.submitFailed") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        delete nextErrors.form;
        return nextErrors;
      });
    }
  };

  const handlePreferredContactMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredContactMethod:
        value as ContactFormData["preferredContactMethod"],
    }));
    if (errors.preferredContactMethod) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.preferredContactMethod;
        return nextErrors;
      });
    }
  };

  const handleCountryChange = (value: string) => {
    const country = value as CountryCode;

    setFormData((prev) => ({
      ...prev,
      country,
      phone: prev.phone,
    }));

    if (errors.phone) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.phone;
        return nextErrors;
      });
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = event.target.value.replace(/[^\d+()\-\s]/g, "");
    setFormData((prev) => ({ ...prev, phone: sanitized }));

    if (errors.phone) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.phone;
        return nextErrors;
      });
    }
  };

  const canSubmit = !isSubmitting;

  return (
    <div
      ref={formContainerRef}
      id={CONTACT_FORM_ID}
      className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-8 lg:p-10"
    >
      {isSuccess ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900">
            {t("form.success.title")}
          </h3>
          <p className="text-gray-600">{t("form.success.description")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="firstName" className="mb-2 block text-gray-900">
                {t("form.firstNameLabel")}
              </Label>
              <Input
                ref={firstNameFieldRef}
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`rounded-2xl border-gray-300 ${errors.firstName ? "border-red-500" : ""}`}
                placeholder={t("form.firstNamePlaceholder")}
              />
              {errors.firstName ? (
                <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
              ) : null}
            </div>

            {!isCompact ? (
              <div>
                <Label htmlFor="lastName" className="mb-2 block text-gray-900">
                  {t("form.lastNameLabel")}
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`rounded-2xl border-gray-300 ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder={t("form.lastNamePlaceholder")}
                />
                {errors.lastName ? (
                  <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 block text-gray-900">
              {t("form.emailLabel")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`rounded-2xl border-gray-300 ${errors.email ? "border-red-500" : ""}`}
              placeholder={t("form.emailPlaceholder")}
            />
            {errors.email ? (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            ) : null}
          </div>

          {!isCompact ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-gray-900">
                  {t("form.countryLabel")}
                </Label>
                {isMounted ? (
                  <Select
                    value={formData.country}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className="rounded-2xl border-gray-300">
                      <SelectValue placeholder={t("form.countryPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACT_COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {`${t(`form.countries.${country.labelKey}`)} (${country.dialCode})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    readOnly
                    value={`${t(`form.countries.${CONTACT_COUNTRIES.find((country) => country.code === formData.country)?.labelKey ?? "ua"}`)} (${CONTACT_COUNTRIES.find((country) => country.code === formData.country)?.dialCode ?? "+380"})`}
                    className="rounded-2xl border-gray-300"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2 block text-gray-900">
                  {t("form.phoneLabel")}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`rounded-2xl border-gray-300 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder={t("form.phonePlaceholder", {
                    countryCode:
                      CONTACT_COUNTRIES.find(
                        (country) => country.code === formData.country,
                      )?.dialCode ?? "+380",
                  })}
                />
                {errors.phone ? (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {!isCompact ? (
            <>
              <div>
                <Label className="mb-2 block text-gray-900">
                  {t("form.preferredContactMethodLabel")}
                </Label>
                {isMounted ? (
                  <Select
                    value={formData.preferredContactMethod}
                    onValueChange={handlePreferredContactMethodChange}
                  >
                    <SelectTrigger
                      className={`rounded-2xl border-gray-300 ${
                        errors.preferredContactMethod ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={t(
                          "form.preferredContactMethodPlaceholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">
                        {t("form.contactMethods.sms")}
                      </SelectItem>
                      <SelectItem value="instagram">
                        {t("form.contactMethods.instagram")}
                      </SelectItem>
                      <SelectItem value="telegram">
                        {t("form.contactMethods.telegram")}
                      </SelectItem>
                      <SelectItem value="phoneCall">
                        {t("form.contactMethods.phoneCall")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    readOnly
                    value=""
                    placeholder={t("form.preferredContactMethodPlaceholder")}
                    className={`rounded-2xl border-gray-300 ${
                      errors.preferredContactMethod ? "border-red-500" : ""
                    }`}
                  />
                )}
                {errors.preferredContactMethod ? (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.preferredContactMethod}
                  </p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="social" className="mb-2 block text-gray-900">
                  {t("form.socialLabel")}
                </Label>
                <Input
                  id="social"
                  name="social"
                  type="text"
                  value={formData.social}
                  onChange={handleChange}
                  className={`rounded-2xl border-gray-300 ${errors.social ? "border-red-500" : ""}`}
                  placeholder={t("form.socialPlaceholder")}
                />
                {errors.social ? (
                  <p className="mt-2 text-sm text-red-600">{errors.social}</p>
                ) : null}
              </div>
            </>
          ) : null}

          {hasProgramPrefill ? null : (
            <div>
              <Label htmlFor="message" className="mb-2 block text-gray-900">
                {t("form.messageLabel")}
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`min-h-[150px] rounded-2xl border-gray-300 ${
                  errors.message ? "border-red-500" : ""
                }`}
                placeholder={t("form.messagePlaceholder")}
              />
              {errors.message ? (
                <p className="mt-2 text-sm text-red-600">{errors.message}</p>
              ) : null}
            </div>
          )}

          <Button
            size="lg"
            type="submit"
            disabled={!canSubmit}
            className="w-full disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t("form.submitting")}
              </>
            ) : (
              <>
                {t("form.submitButton")}
                <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          {errors.form ? (
            <p className="text-sm text-red-600">{errors.form}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}
