import { setRequestLocale } from "next-intl/server";
import { Services } from "@/components/sections/Services";
import { isLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

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
    <main className="bg-gray-100">
      <Services />
    </main>
  );
}
