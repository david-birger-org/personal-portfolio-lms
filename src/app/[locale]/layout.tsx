import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";
import { getMetadataBase } from "@/lib/seo";
import "../globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export const dynamic = "force-static";
export const dynamicParams = false;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
      metadataBase: getMetadataBase(),
      title: {
        default:
          "Дaвід Біргер - Тренер з натурального бодібілдингу і Віцечемпіон світу WNBF",
        template: "%s | Давід Біргер",
      },
      description:
        "20+ років досвіду у спорті. Допомагаю будувати твою кращу версію себе через дисципліну, естетику й натуральний бодібілдинг: підготовка до змагань, рекомпозиція, набір мʼязової маси, уроки позування та системний супровід.",
      openGraph: {
        type: "website",
        locale: "uk_UA",
        siteName: "David Birger",
        images: [
          {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Дaвід Біргер - Тренер з натурального бодібілдингу",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        images: ["/og-image.jpg"],
      },
    };
  }

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: "David Birger - Natural Bodybuilding Coach and WNBF Pro",
      template: "%s | David Birger",
    },
    description:
      "I help you build your best self through discipline, aesthetics, and natural bodybuilding: contest prep, posing lessons, body recomposition, muscle gain, and structured coaching support.",
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "David Birger",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "David Birger - Natural Bodybuilding Coach",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.jpg"],
    },
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
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider
          key={locale}
          locale={locale}
          messages={messages}
        >
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
