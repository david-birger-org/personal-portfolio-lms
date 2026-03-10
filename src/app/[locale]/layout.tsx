import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { AdminAwareFooter } from "@/components/layout/AdminAwareFooter";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { isLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  if (locale === "ua") {
    return {
      title: "Давід Біргер - Професійний коучинг та тренування",
      description:
        "Професійний фітнес-коучинг та персоналізовані програми тренувань. Досягай своїх фітнес-цілей з експертною підтримкою, індивідуальними планами та постійною допомогою.",
    };
  }

  return {
    title: "David Birger - Professional Coaching & Training",
    description:
      "Professional fitness coaching and personalized training programs. Achieve your fitness goals with expert guidance, tailored plans, and ongoing support.",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const allMessages = await getMessages({ locale });
  const messages = {
    // Keep the client payload small. Only client components that call
    // `useTranslations()` need their namespaces here.
    contact: (allMessages as Record<string, unknown>).contact,
  };

  return (
    <>
      <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
        <Navigation locale={locale} />
        {children}
        <AdminAwareFooter>
          <Footer />
        </AdminAwareFooter>
      </NextIntlClientProvider>
      <ScrollToTop />
    </>
  );
}
