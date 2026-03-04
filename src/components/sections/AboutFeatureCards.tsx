import {
  Award,
  CalendarClock,
  type LucideIcon,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function AboutFeatureCards() {
  const t = await getTranslations("about");

  type FeatureKey =
    | "experience"
    | "happyClients"
    | "certified"
    | "personalized"
    | "results";

  const featureCards = t.raw("featureCards") as Record<
    FeatureKey,
    { title: string; description: string }
  >;

  const features: Array<{ icon: LucideIcon; key: FeatureKey }> = [
    {
      icon: CalendarClock,
      key: "experience",
    },
    {
      icon: Users,
      key: "happyClients",
    },
    {
      icon: Award,
      key: "certified",
    },
    {
      icon: Target,
      key: "personalized",
    },
    {
      icon: TrendingUp,
      key: "results",
    },
  ];

  return (
    <section className="bg-white py-[4.5rem] md:py-24 lg:py-36">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl lg:max-w-5xl">
          <div className="grid grid-cols-6 gap-3 lg:grid-cols-5 lg:gap-5">
            {features.map((feature, index) => (
              <div
                key={feature.key}
                className={`col-span-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center transition-all hover:bg-gray-100 lg:col-span-1 lg:rounded-3xl lg:p-6 ${
                  index === 3
                    ? "col-start-2 lg:col-start-auto"
                    : index === 4
                      ? "col-start-4 lg:col-start-auto"
                      : ""
                }`}
              >
                <feature.icon className="mx-auto mb-2 h-6 w-6 text-gray-900 lg:mb-3 lg:h-7 lg:w-7" />
                <div className="mb-0.5 text-xs font-semibold text-gray-900 lg:text-sm">
                  {featureCards[feature.key].title}
                </div>
                <div className="text-xs text-gray-600 lg:text-sm">
                  {featureCards[feature.key].description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
