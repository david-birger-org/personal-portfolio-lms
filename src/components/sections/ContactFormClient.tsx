"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_FORM_ID } from "@/constants/links";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPhoneValid(value: string) {
  return value.replace(/\D/g, "").length >= 7;
}

export function ContactFormClient({
  compact: _compact = false,
}: {
  compact?: boolean;
}) {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("form.validation.firstNameRequired");
    }

    if (formData.email.trim() && !EMAIL_PATTERN.test(formData.email.trim())) {
      newErrors.email = t("form.validation.emailInvalid");
    }

    if (formData.phone.trim() && !isPhoneValid(formData.phone.trim())) {
      newErrors.phone = t("form.validation.phoneInvalid");
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact = t("form.validation.atLeastOneContactRequired");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("form.validation.messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("form.validation.messageMinLength");
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
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      setIsSuccess(true);
      setFormData({
        firstName: "",
        email: "",
        phone: "",
        message: "",
      });

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
    if (errors[name] || errors.contact || errors.form) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        delete nextErrors.contact;
        delete nextErrors.form;
        return nextErrors;
      });
    }
  };

  const hasAnyContact =
    formData.email.trim().length > 0 || formData.phone.trim().length > 0;
  const canSubmit =
    formData.firstName.trim().length > 0 &&
    formData.message.trim().length >= 10 &&
    hasAnyContact &&
    !isSubmitting;

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

          <div className="grid gap-4 md:grid-cols-2">
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

            <div>
              <Label htmlFor="phone" className="mb-2 block text-gray-900">
                {t("form.phoneLabel")}
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`rounded-2xl border-gray-300 ${errors.phone ? "border-red-500" : ""}`}
                placeholder={t("form.phonePlaceholder", {
                  countryCode: "+380",
                })}
              />
              {errors.phone ? (
                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
              ) : null}
            </div>
          </div>

          {errors.contact ? (
            <p className="text-sm text-red-600">{errors.contact}</p>
          ) : null}

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
