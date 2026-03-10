"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

type SupportedCurrency = "UAH" | "USD";
type OutputMode = "link" | "qr";

interface InvoiceResult {
  invoiceId?: string;
  pageUrl: string;
  qrCodeDataUrl?: string;
}

async function copyToClipboard(value: string) {
  if (!navigator.clipboard) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}

export function MonobankInvoiceForm() {
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState<SupportedCurrency>("UAH");
  const [output, setOutput] = useState<OutputMode>("link");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const parsedAmount = useMemo(() => Number(amount), [amount]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsCopied(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/monobank/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          description,
          amount: parsedAmount,
          currency,
          output,
        }),
      });

      const data = (await response.json()) as
        | InvoiceResult
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          data && "error" in data ? data.error : "Request failed",
        );
      }

      const invoice = data as InvoiceResult;
      setResult(invoice);

      const copied = await copyToClipboard(invoice.pageUrl);
      setIsCopied(copied);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unexpected error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!result?.pageUrl) {
      return;
    }

    const copied = await copyToClipboard(result.pageUrl);
    setIsCopied(copied);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate payment link or QR</CardTitle>
        <CardDescription>
          Create a Mono invoice from admin. Enter customer name, description,
          and amount, choose currency and output mode, then generate.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Payment for coaching package"
              className="min-h-20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={currency}
                onValueChange={(value) =>
                  setCurrency(value as SupportedCurrency)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UAH">UAH</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Generate</Label>
              <Select
                value={output}
                onValueChange={(value) => setOutput(value as OutputMode)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select output mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Payment link</SelectItem>
                  <SelectItem value="qr">QR code</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Generate"}
            </Button>
            {result && (
              <Button type="button" variant="outline" onClick={handleCopy}>
                Copy link
              </Button>
            )}
            {isCopied && <span className="text-sm text-green-600">Copied</span>}
          </div>

          {error && (
            <p className="border-destructive/50 text-destructive rounded-lg border px-3 py-2 text-sm">
              {error}
            </p>
          )}
        </form>

        {result && (
          <div className="mt-6 space-y-3 rounded-lg border p-4">
            <p className="text-sm font-medium">Generated invoice</p>
            {result.invoiceId && (
              <p className="text-muted-foreground break-all text-xs">
                invoiceId: {result.invoiceId}
              </p>
            )}
            <a
              href={result.pageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary block break-all text-sm underline"
            >
              {result.pageUrl}
            </a>
            {result.qrCodeDataUrl && (
              <div className="pt-2">
                <Image
                  src={result.qrCodeDataUrl}
                  alt="Monobank payment QR code"
                  width={192}
                  height={192}
                  unoptimized
                  className="h-48 w-48 rounded-lg border p-2"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
