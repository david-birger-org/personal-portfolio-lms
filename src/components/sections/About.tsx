import { Award, CheckCircle2, Target, TrendingUp } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export async function About() {
  const t = await getTranslations("about");

  const features = [
    {
      icon: Award,
      title: "Certified",
      description: "CPT",
      key: "certified",
    },
    {
      icon: Target,
      title: "Personalized",
      description: "Custom Plans",
      key: "personalized",
    },
    {
      icon: TrendingUp,
      title: "Results",
      description: "98% Success",
      key: "results",
    },
  ];

  const achievements = t.raw("achievements") as Array<{ name: string }>;

  return (
    <section
      id="about"
      className="py-32 md:py-40 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-gray-100">
              <div className="relative aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1758274539089-8b2bd10eee92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhbnNmb3JtYXRpb24lMjB3b3Jrb3V0fGVufDF8fHx8MTc2OTcwNTMwNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Fitness Training"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-100 transition-all"
                >
                  <feature.icon className="w-6 h-6 mx-auto text-gray-900 mb-2" />
                  <div className="text-xs font-semibold text-gray-900 mb-0.5">
                    {feature.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {feature.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-gray-600 font-medium text-sm uppercase tracking-wider">
              {t("tag")}
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl mt-4 mb-6 text-gray-900 tracking-tight">
              {t("title")}
              <br />
              <span className="text-gray-500">{t("titleAccent")}</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t("description")}
            </p>

            <div className="space-y-4 mb-8">
              {achievements.map((achievement) => (
                <div key={achievement.name} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{achievement.name}</span>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="rounded-full bg-gray-900 px-6 text-white hover:bg-gray-800"
            >
              <Link href="/about">{t("readFullBiography")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
