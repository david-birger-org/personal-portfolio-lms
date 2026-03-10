import { NextResponse } from "next/server";

interface MonobankStatementItem {
  invoiceId?: string;
  status?: string;
  maskedPan?: string;
  date?: string;
  paymentScheme?: string;
  amount?: number;
  profitAmount?: number;
  ccy?: number;
  rrn?: string;
  reference?: string;
  destination?: string;
}

interface MonobankStatementResponse {
  list?: MonobankStatementItem[];
}

function getUnixTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

function getRangeDays(searchParams: URLSearchParams) {
  const daysParam = Number(searchParams.get("days") ?? "30");
  return Number.isFinite(daysParam)
    ? Math.min(Math.max(daysParam, 1), 365)
    : 30;
}

const MAX_RANGE_SECONDS = 31 * 24 * 60 * 60;

async function fetchStatementChunk({
  token,
  from,
  to,
}: {
  token: string;
  from: number;
  to: number;
}) {
  const statementUrl = new URL(
    "https://api.monobank.ua/api/merchant/statement",
  );
  statementUrl.searchParams.set("from", String(from));
  statementUrl.searchParams.set("to", String(to));

  const monobankResponse = await fetch(statementUrl, {
    method: "GET",
    headers: {
      "X-Token": token,
    },
    cache: "no-store",
  });

  if (!monobankResponse.ok) {
    const errorText = await monobankResponse.text();
    throw new Error(`Monobank API error: ${errorText}`);
  }

  const response = (await monobankResponse.json()) as MonobankStatementResponse;

  return response.list ?? [];
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
    const safeDays = getRangeDays(requestUrl.searchParams);
    const to = getUnixTimestamp(new Date());
    const from = to - safeDays * 24 * 60 * 60;
    const items: MonobankStatementItem[] = [];

    let chunkFrom = from;

    while (chunkFrom < to) {
      const chunkTo = Math.min(chunkFrom + MAX_RANGE_SECONDS - 1, to);
      const chunkItems = await fetchStatementChunk({
        token,
        from: chunkFrom,
        to: chunkTo,
      });

      items.push(...chunkItems);
      chunkFrom = chunkTo + 1;
    }

    return NextResponse.json({
      list: items,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json(
      { error: `Failed to load statement: ${message}` },
      { status: 500 },
    );
  }
}
