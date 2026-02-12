import { getTranslations } from "next-intl/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionTag from "@/components/ui/SectionTag";

export async function Journey() {
  const t = await getTranslations("journey");
  const cards = t.raw("cards") as Array<{ title: string; description: string }>;

  return (
    <section
      id="journey"
      className="bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <SectionTag>{t("tag")}</SectionTag>
          <h2 className="mt-4 mb-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            {t("title")}{" "}
            <span className="text-gray-500">{t("titleAccent")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <div key={card.title} className="relative">
              {index < cards.length - 1 && (
                <div className="absolute top-10 left-[62%] hidden h-px w-[76%] bg-gradient-to-r from-gray-300 to-transparent md:block" />
              )}

              <Card className="h-full rounded-3xl border-gray-200/90 bg-white/85 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.5)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_20px_45px_-25px_rgba(15,23,42,0.5)]">
                <CardHeader className="gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-900">
                      0{index + 1}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent" />
                  </div>
                  <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-600">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
