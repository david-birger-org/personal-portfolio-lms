import { NextResponse } from "next/server";
import QRCode from "qrcode";

type SupportedCurrency = "UAH" | "USD";
type OutputMode = "link" | "qr";

const CURRENCY_CODE: Record<SupportedCurrency, number> = {
  UAH: 980,
  USD: 840,
};

function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      amount?: number;
      currency?: SupportedCurrency;
      customerName?: string;
      description?: string;
      output?: OutputMode;
    };

    const amount = Number(body.amount);
    const currency = body.currency;
    const customerName = body.customerName?.trim();
    const description = body.description?.trim();
    const output = body.output;

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0." },
        { status: 400 },
      );
    }

    if (currency !== "UAH" && currency !== "USD") {
      return NextResponse.json(
        { error: "Currency must be UAH or USD." },
        { status: 400 },
      );
    }

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Description is required." },
        { status: 400 },
      );
    }

    if (output !== "link" && output !== "qr") {
      return NextResponse.json(
        { error: "Output mode must be link or qr." },
        { status: 400 },
      );
    }

    const token = process.env.MONOBANK_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "MONOBANK_TOKEN is missing in environment variables." },
        { status: 500 },
      );
    }

    const monobankResponse = await fetch(
      "https://api.monobank.ua/api/merchant/invoice/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Token": token,
        },
        body: JSON.stringify({
          amount: toMinorUnits(amount),
          ccy: CURRENCY_CODE[currency],
          merchantPaymInfo: {
            reference: `poc-${Date.now()}`,
            destination: description,
            comment: `${customerName}: ${description}`,
          },
        }),
      },
    );

    if (!monobankResponse.ok) {
      const errorText = await monobankResponse.text();
      return NextResponse.json(
        { error: `Monobank API error: ${errorText}` },
        { status: 502 },
      );
    }

    const invoice = (await monobankResponse.json()) as {
      invoiceId?: string;
      pageUrl?: string;
    };

    if (!invoice.pageUrl) {
      return NextResponse.json(
        { error: "Monobank response did not include pageUrl." },
        { status: 502 },
      );
    }

    let qrCodeDataUrl: string | undefined;
    if (output === "qr") {
      qrCodeDataUrl = await QRCode.toDataURL(invoice.pageUrl, {
        width: 320,
        margin: 1,
      });
    }

    return NextResponse.json({
      invoiceId: invoice.invoiceId,
      pageUrl: invoice.pageUrl,
      qrCodeDataUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json(
      { error: `Failed to create invoice: ${message}` },
      { status: 500 },
    );
  }
}
