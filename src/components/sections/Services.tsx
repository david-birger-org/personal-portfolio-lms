import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { TrackedLink } from "@/components/analytics/TrackedLink";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { buttonVariants } from "@/components/ui/button";
import { CONTACT_FORM_ID, CONTACT_PAGE_HREF } from "@/constants/links";
import {
  formatPrice,
  getDisplayPriceMinor,
  resolveDisplayCurrency,
} from "@/lib/pricing";
import {
  fetchActiveProducts,
  type PortfolioProduct,
} from "@/lib/server/lms-sls-products";
import { cn } from "@/lib/utils";

const DEFAULT_ADMIN_URL = "https://app.davidbirger.com";

function getAdminUrl() {
  return (
    process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/\/$/, "") ??
    DEFAULT_ADMIN_URL
  );
}

function resolveImageUrl(product: PortfolioProduct, locale: string) {
  const raw = product.imageUrl;
  if (!raw) return null;
  const imageLocale = locale === "ua" ? "ua" : "en";
  return raw.replace("{locale}", imageLocale);
}

function resolveProductName(product: PortfolioProduct, locale: string) {
  return locale === "ua" ? product.nameUk : product.nameEn;
}

export async function Services({ locale }: { locale: string }) {
  const t = await getTranslations("services");
  const products = await fetchActiveProducts();
  const displayCurrency = resolveDisplayCurrency(locale);
  const adminUrl = getAdminUrl();

  if (products.length === 0) return null;

  return (
    <section
      id="services"
      className="relative scroll-mt-40 overflow-hidden bg-gray-50 pb-14 pt-20 md:scroll-mt-44 md:pb-20 md:pt-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag={t("tag")}
          title={t("title")}
          titleAccent={t("titleAccent")}
          description={t("description")}
          className="mb-12 md:mb-16"
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {products.map((product, index) => {
            const image = resolveImageUrl(product, locale);
            const name = resolveProductName(product, locale);
            const isFixed = product.pricingType === "fixed";
            const priceMinor = getDisplayPriceMinor(product, displayCurrency);
            const priceLabel =
              isFixed && priceMinor !== null
                ? formatPrice(priceMinor, displayCurrency, locale)
                : null;

            const href = isFixed
              ? `${adminUrl}/checkout?product=${encodeURIComponent(product.slug)}&c=${displayCurrency}`
              : `${CONTACT_PAGE_HREF}?program=${encodeURIComponent(name)}#${CONTACT_FORM_ID}`;

            const ctaLabel = isFixed
              ? priceLabel
                ? `${t("learnMore")} · ${priceLabel}`
                : t("learnMore")
              : t("learnMore");

            return (
              <div
                key={product.id}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-gray-200 bg-black lg:col-span-2",
                  index === 3 && "lg:col-start-2",
                  index === 4 && "lg:col-start-4",
                )}
              >
                <div className="relative aspect-[4/5] bg-[#050a26]">
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35 group-focus-within:bg-black/35" />

                  {priceLabel ? (
                    <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-slate-900 shadow-lg backdrop-blur-xs">
                      {priceLabel}
                    </div>
                  ) : null}

                  <div className="absolute inset-x-4 bottom-4 opacity-100 transition duration-300 md:pointer-events-none md:translate-y-2 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                    <TrackedLink
                      href={href}
                      analyticsId={
                        isFixed ? "services_checkout" : "services_learn_more"
                      }
                      analyticsSection="services"
                      analyticsProperties={{
                        program: name,
                        product_slug: product.slug,
                        pricing_type: product.pricingType,
                      }}
                      className={buttonVariants({
                        size: "sm",
                        className:
                          "w-full border border-white/80 bg-white/90 text-slate-900 shadow-lg backdrop-blur-xs hover:bg-white",
                      })}
                    >
                      {ctaLabel}
                    </TrackedLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
