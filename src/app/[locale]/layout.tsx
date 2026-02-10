import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function isValidLocale(
  locale: string,
): locale is (typeof routing.locales)[number] {
  return routing.locales.includes(locale as (typeof routing.locales)[number]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

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

  if (!isValidLocale(locale)) {
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
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navigation locale={locale} />
          {children}
          <Footer />
        </NextIntlClientProvider>
        <ScrollToTop />
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
