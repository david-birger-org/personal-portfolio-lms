"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { CONTACT_FORM_ID } from "@/constants/links";

const CONTACT_COUNTRIES = [
  { code: "UA", dialCode: "+380", labelKey: "ua" },
  { code: "US", dialCode: "+1", labelKey: "us" },
  { code: "PL", dialCode: "+48", labelKey: "pl" },
  { code: "DE", dialCode: "+49", labelKey: "de" },
] as const;

type CountryCode = (typeof CONTACT_COUNTRIES)[number]["code"];

const SOCIAL_HANDLE_PATTERN = /^@?[a-zA-Z0-9._]{2,32}$/;

export function ContactFormClient() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "UA" as CountryCode,
    phone: "",
    preferredContactMethod: "",
    social: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("form.validation.firstNameRequired");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("form.validation.lastNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("form.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("form.validation.emailInvalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("form.validation.phoneRequired");
    } else {
      try {
        const { parsePhoneNumberFromString } = await import(
          "libphonenumber-js/min"
        );
        const parsed = parsePhoneNumberFromString(
          formData.phone,
          formData.country,
        );
        if (!parsed?.isValid()) {
          newErrors.phone = t("form.validation.phoneInvalid");
        }
      } catch {
        const digits = formData.phone.replace(/\D/g, "");
        if (digits.length < 8) {
          newErrors.phone = t("form.validation.phoneInvalid");
        }
      }
    }

    if (!formData.preferredContactMethod.trim()) {
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

    if (!formData.message.trim()) {
      newErrors.message = t("form.validation.messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("form.validation.messageMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      country: "UA",
      phone: "",
      preferredContactMethod: "",
      social: "",
      message: "",
    });

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const handlePreferredContactMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredContactMethod: value }));
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^\d+()\-\s]/g, "");
    setFormData((prev) => ({ ...prev, phone: sanitized }));

    if (errors.phone) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.phone;
        return nextErrors;
      });
    }
  };

  return (
    <div
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
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="firstName" className="mb-2 block text-gray-900">
                {t("form.firstNameLabel")}
              </Label>
              <Input
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block text-gray-900">
                {t("form.countryLabel")}
              </Label>
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

          <div>
            <Label className="mb-2 block text-gray-900">
              {t("form.preferredContactMethodLabel")}
            </Label>
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
                  placeholder={t("form.preferredContactMethodPlaceholder")}
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

          <Button
            size="lg"
            type="submit"
            disabled={isSubmitting}
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
        </form>
      )}
    </div>
  );
}
