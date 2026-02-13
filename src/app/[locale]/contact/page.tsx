import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/components/sections/Contact";
import { isLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (isLocale(locale)) {
    setRequestLocale(locale);
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <Contact />
    </main>
  );
}
