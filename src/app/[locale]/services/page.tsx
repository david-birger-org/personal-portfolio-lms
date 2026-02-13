import { setRequestLocale } from "next-intl/server";
import { Services } from "@/components/sections/Services";
import { isLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (isLocale(locale)) {
    setRequestLocale(locale);
  }

  return (
    <main className="min-h-screen bg-gray-100 pt-20 md:pt-24">
      <Services isComingSoon />
    </main>
  );
}
