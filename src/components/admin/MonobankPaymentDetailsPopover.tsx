"use client";

import { Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface PaymentDetails {
  invoiceId?: string;
  status?: string;
  failureReason?: string;
  errCode?: string;
  amount?: number;
  ccy?: number;
  finalAmount?: number;
  createdDate?: string;
  modifiedDate?: string;
  reference?: string;
  destination?: string;
  paymentInfo?: {
    maskedPan?: string;
    approvalCode?: string;
    rrn?: string;
    tranId?: string;
    terminal?: string;
    bank?: string;
    paymentSystem?: string;
  };
  error?: string;
}

function getCurrencyLabel(ccy?: number) {
  if (ccy === 980) {
    return "UAH";
  }

  if (ccy === 840) {
    return "USD";
  }

  return ccy ? String(ccy) : "-";
}

function formatMoney(minorUnits?: number, ccy?: number) {
  if (typeof minorUnits !== "number") {
    return "-";
  }

  return `${(minorUnits / 100).toFixed(2)} ${getCurrencyLabel(ccy)}`;
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

function PaymentDetailsBody({
  invoiceId,
  isLoading,
  error,
  details,
}: {
  invoiceId?: string;
  isLoading: boolean;
  error: string | null;
  details: PaymentDetails | null;
}) {
  return (
    <div className="space-y-4 p-4 sm:p-5">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">Payment details</h3>
        <p className="text-muted-foreground font-mono text-xs break-all">
          {invoiceId ?? "-"}
        </p>
      </div>

      {isLoading && (
        <p className="text-muted-foreground text-sm">
          Loading payment details...
        </p>
      )}

      {error && (
        <p className="text-destructive border-destructive/50 rounded-xl border px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {details && !isLoading && (
        <div className="space-y-3 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Status
              </p>
              <p className="mt-1 font-medium">{details.status ?? "-"}</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Amount
              </p>
              <p className="mt-1 font-medium">
                {formatMoney(details.amount, details.ccy)}
              </p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Final amount
              </p>
              <p className="mt-1 font-medium">
                {formatMoney(details.finalAmount, details.ccy)}
              </p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Card
              </p>
              <p className="mt-1">{details.paymentInfo?.maskedPan ?? "-"}</p>
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <p className="text-muted-foreground text-xs uppercase tracking-wide">
              Description
            </p>
            <p className="mt-1">{details.destination ?? "-"}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Created
              </p>
              <p className="mt-1">{formatDate(details.createdDate)}</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Updated
              </p>
              <p className="mt-1">{formatDate(details.modifiedDate)}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Bank
              </p>
              <p className="mt-1">{details.paymentInfo?.bank ?? "-"}</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Payment system
              </p>
              <p className="mt-1">
                {details.paymentInfo?.paymentSystem ?? "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MonobankPaymentDetailsPopover({
  invoiceId,
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
}: {
  invoiceId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = controlledOpen ?? uncontrolledOpen;

  const loadDetails = useCallback(async () => {
    if (!invoiceId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/monobank/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as PaymentDetails;

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load payment details");
      }

      setDetails(payload);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Unexpected error";
      setDetails(null);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [invoiceId]);

  const content = (
    <PopoverContent align="end" className="w-[min(92vw,28rem)] p-0">
      <PaymentDetailsBody
        invoiceId={invoiceId}
        isLoading={isLoading}
        error={error}
        details={details}
      />
    </PopoverContent>
  );

  useEffect(() => {
    if (hideTrigger && open && !details && !error && !isLoading) {
      void loadDetails();
    }
  }, [details, error, hideTrigger, isLoading, loadDetails, open]);

  if (hideTrigger) {
    return content;
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen);

        if (controlledOpen === undefined) {
          setUncontrolledOpen(nextOpen);
        }

        if (nextOpen && !details && !error && !isLoading) {
          void loadDetails();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open payment details"
          disabled={!invoiceId}
        >
          <Eye />
        </Button>
      </PopoverTrigger>
      {content}
    </Popover>
  );
}
