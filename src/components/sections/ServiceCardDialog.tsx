"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DialogLabels {
  includesLabel: string;
  forWhoLabel: string;
  inquiryTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  sendButton: string;
  sendingButton: string;
  successMessage: string;
  errorMessage: string;
  invalidEmailMessage: string;
  invalidPhoneMessage: string;
  atLeastOneContactMessage: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  forWho?: string[];
}

interface ServiceDialogManagerProps {
  items: ServiceItem[];
  labels: DialogLabels;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isContactValid(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  if (EMAIL_PATTERN.test(trimmed)) {
    return true;
  }

  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7;
}

export function ServiceDialogManager({
  items,
  labels,
}: ServiceDialogManagerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const fieldIdBase = useMemo(
    () => (activeItem ? `${activeItem.title}-inquiry` : ""),
    [activeItem],
  );

  const hasName = useMemo(() => name.trim().length > 0, [name]);
  const hasEmail = useMemo(() => email.trim().length > 0, [email]);
  const hasPhone = useMemo(() => phone.trim().length > 0, [phone]);
  const hasAnyContact = hasEmail || hasPhone;
  const emailValid = useMemo(
    () => (!hasEmail ? true : EMAIL_PATTERN.test(email.trim())),
    [email, hasEmail],
  );
  const phoneValid = useMemo(
    () => (!hasPhone ? true : isContactValid(phone)),
    [phone, hasPhone],
  );
  const canSubmit =
    hasName && hasAnyContact && emailValid && phoneValid && !isSubmitting;

  useEffect(() => {
    const handleCardClick = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement).closest(
        "[data-service-index]",
      );
      if (!trigger) {
        return;
      }
      const index = Number(trigger.getAttribute("data-service-index"));
      if (!Number.isNaN(index) && index >= 0 && index < items.length) {
        setActiveIndex(index);
      }
    };

    document.addEventListener("click", handleCardClick);
    return () => {
      document.removeEventListener("click", handleCardClick);
    };
  }, [items.length]);

  useEffect(() => {
    if (!showSuccessAlert) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showSuccessAlert]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setHasAttemptedSubmit(false);
    setSubmitError(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActiveIndex(null);
      resetForm();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    if (!canSubmit || !activeItem) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service: activeItem.title,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit service request");
      }

      setActiveIndex(null);
      resetForm();
      setShowSuccessAlert(true);
    } catch {
      setSubmitError(labels.errorMessage);
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={activeIndex !== null} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          {activeItem ? (
            <div className="space-y-4">
              <DialogHeader className="gap-3 border-b border-slate-200/80 pb-4 pr-10">
                <DialogTitle className="text-xl tracking-tight text-slate-900 sm:text-2xl">
                  {activeItem.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {activeItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[52vh] space-y-4 overflow-y-auto py-1 pr-1">
                <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 sm:p-5">
                  <h4 className="mb-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    {labels.includesLabel}
                  </h4>
                  <ul className="space-y-2.5">
                    {activeItem.features.map((feature) => (
                      <li
                        key={`${activeItem.title}-${feature}`}
                        className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                      >
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeItem.forWho?.length ? (
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
                    <h4 className="mb-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                      {labels.forWhoLabel}
                    </h4>
                    <ul className="space-y-2.5">
                      {activeItem.forWho.map((audience) => (
                        <li
                          key={`${activeItem.title}-${audience}`}
                          className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                        >
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                          <span>{audience}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 border-t border-slate-200/80 pt-4"
              >
                <h4 className="text-sm font-semibold text-slate-900">
                  {labels.inquiryTitle}
                </h4>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${fieldIdBase}-name`}
                    className="text-slate-800"
                  >
                    {labels.nameLabel}
                  </Label>
                  <Input
                    id={`${fieldIdBase}-name`}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={labels.namePlaceholder}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${fieldIdBase}-email`}
                    className="text-slate-800"
                  >
                    {labels.emailLabel}
                  </Label>
                  <Input
                    id={`${fieldIdBase}-email`}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={labels.emailPlaceholder}
                    className="border-slate-300"
                  />
                  {hasAttemptedSubmit && hasEmail && !emailValid ? (
                    <p className="text-xs text-red-600">
                      {labels.invalidEmailMessage}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${fieldIdBase}-phone`}
                    className="text-slate-800"
                  >
                    {labels.phoneLabel}
                  </Label>
                  <Input
                    id={`${fieldIdBase}-phone`}
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={labels.phonePlaceholder}
                    className="border-slate-300"
                  />
                  {hasAttemptedSubmit && hasPhone && !phoneValid ? (
                    <p className="text-xs text-red-600">
                      {labels.invalidPhoneMessage}
                    </p>
                  ) : null}
                </div>

                {hasAttemptedSubmit && !hasAnyContact ? (
                  <p className="text-xs text-red-600">
                    {labels.atLeastOneContactMessage}
                  </p>
                ) : null}

                {submitError ? (
                  <p className="text-sm text-red-600">{submitError}</p>
                ) : null}

                <Button type="submit" className="w-full" disabled={!canSubmit}>
                  {isSubmitting ? labels.sendingButton : labels.sendButton}
                </Button>
              </form>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {showSuccessAlert ? (
        <div className="fixed right-4 bottom-4 z-[70] max-w-xs rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-lg">
          {labels.successMessage}
        </div>
      ) : null}
    </>
  );
}
