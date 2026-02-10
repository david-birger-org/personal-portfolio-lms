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
      className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <SectionTag>{t("tag")}</SectionTag>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4 tracking-tight">
            {t("title")}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {t("titleAccent")}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card) => (
            <div key={card.title}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
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
