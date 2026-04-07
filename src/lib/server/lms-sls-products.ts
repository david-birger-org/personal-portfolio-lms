import { cache } from "react";

export type PricingType = "fixed" | "on_request";

export interface PortfolioProduct {
  id: string;
  slug: string;
  nameUk: string;
  nameEn: string;
  descriptionUk: string | null;
  descriptionEn: string | null;
  pricingType: PricingType;
  priceUahMinor: number | null;
  priceUsdMinor: number | null;
  imageUrl: string | null;
  active: boolean;
  sortOrder: number;
}

interface ProductsResponse {
  products?: PortfolioProduct[];
  error?: string;
}

export const fetchActiveProducts = cache(
  async (): Promise<PortfolioProduct[]> => {
    const baseUrl = process.env.LMS_SLS_URL?.trim();
    if (!baseUrl) {
      console.error("LMS_SLS_URL is not set; cannot fetch products");
      return [];
    }

    try {
      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}/api/products`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        console.error(
          `Failed to fetch products from lms-sls: HTTP ${response.status}`,
        );
        return [];
      }

      const payload = (await response.json()) as ProductsResponse;
      return payload.products ?? [];
    } catch (error) {
      console.error("Failed to fetch products from lms-sls", error);
      return [];
    }
  },
);
