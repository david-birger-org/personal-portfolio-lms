"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { capturePostHogEvent } from "@/lib/posthog-client";
import { POSTHOG_EVENTS } from "@/lib/posthog-events";
import { cn } from "@/lib/utils";

type AnalyticsPropertyValue = boolean | null | number | string | undefined;

interface ServicesBuyButtonProps {
  href: string;
  label: string;
  analyticsId: string;
  analyticsSection: string;
  analyticsProperties?: Record<string, AnalyticsPropertyValue>;
  modalTitle: string;
  modalDescription: string;
  modalAccountNotice: string;
  cancelLabel: string;
  confirmLabel: string;
  className?: string;
}

export function ServicesBuyButton({
  href,
  label,
  analyticsId,
  analyticsSection,
  analyticsProperties,
  modalTitle,
  modalDescription,
  modalAccountNotice,
  cancelLabel,
  confirmLabel,
  className,
}: ServicesBuyButtonProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleProceed = () => {
    capturePostHogEvent(POSTHOG_EVENTS.ctaClicked, {
      cta_id: analyticsId,
      destination: href,
      path: pathname,
      section: analyticsSection,
      ...analyticsProperties,
    });

    window.location.assign(href);
  };

  const modal =
    mounted && open
      ? createPortal(
          <div
            aria-labelledby="services-buy-modal-title"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm sm:p-6"
            role="dialog"
          >
            <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:p-8">
              <h3
                id="services-buy-modal-title"
                className="text-xl font-semibold text-slate-950"
              >
                {modalTitle}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {modalDescription}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {modalAccountNotice}
              </p>

              <div className="mt-10 pt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-slate-300 bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900",
                  )}
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  {cancelLabel}
                </button>
                <Button size="sm" type="button" onClick={handleProceed}>
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <Button
        className={className}
        size="sm"
        type="button"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      {modal}
    </>
  );
}
