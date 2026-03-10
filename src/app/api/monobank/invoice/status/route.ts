import { NextResponse } from "next/server";

interface MonobankPaymentInfo {
  maskedPan?: string;
  approvalCode?: string;
  rrn?: string;
  tranId?: string;
  terminal?: string;
  bank?: string;
  paymentSystem?: string;
  paymentMethod?: string;
  fee?: number;
  country?: string;
  agentFee?: number;
}

interface MonobankCancelItem {
  amount?: number;
  ccy?: number;
  date?: string;
  approvalCode?: string;
  rrn?: string;
  maskedPan?: string;
}

interface MonobankInvoiceStatusResponse {
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
  paymentInfo?: MonobankPaymentInfo;
  cancelList?: MonobankCancelItem[];
}

export async function GET(request: Request) {
  try {
    const token = process.env.MONOBANK_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "MONOBANK_TOKEN is missing in environment variables." },
        { status: 500 },
      );
    }

    const requestUrl = new URL(request.url);
    const invoiceId = requestUrl.searchParams.get("invoiceId")?.trim();

    if (!invoiceId) {
      return NextResponse.json(
        { error: "invoiceId is required." },
        { status: 400 },
      );
    }

    const statusUrl = new URL(
      "https://api.monobank.ua/api/merchant/invoice/status",
    );
    statusUrl.searchParams.set("invoiceId", invoiceId);

    const monobankResponse = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "X-Token": token,
      },
      cache: "no-store",
    });

    if (!monobankResponse.ok) {
      const errorText = await monobankResponse.text();
      return NextResponse.json(
        { error: `Monobank API error: ${errorText}` },
        { status: 502 },
      );
    }

    const invoiceStatus =
      (await monobankResponse.json()) as MonobankInvoiceStatusResponse;

    return NextResponse.json(invoiceStatus);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json(
      { error: `Failed to load payment details: ${message}` },
      { status: 500 },
    );
  }
}
