import type { PortfolioProduct } from "@/lib/server/lms-sls-products";

export type DisplayCurrency = "UAH" | "USD";

export function resolveDisplayCurrency(locale: string): DisplayCurrency {
  return locale === "ua" ? "UAH" : "USD";
}

export function getDisplayPriceMinor(
  product: PortfolioProduct,
  currency: DisplayCurrency,
): number | null {
  if (product.pricingType !== "fixed") return null;
  return currency === "UAH" ? product.priceUahMinor : product.priceUsdMinor;
}

export function formatPrice(
  minor: number,
  currency: DisplayCurrency,
  locale: string,
): string {
  const major = minor / 100;
  const formatter = new Intl.NumberFormat(locale === "ua" ? "uk-UA" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: major % 1 === 0 ? 0 : 2,
  });
  return formatter.format(major);
}
