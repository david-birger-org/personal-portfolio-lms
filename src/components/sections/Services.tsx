import {
  Apple,
  Calendar,
  Dumbbell,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export async function Services() {
  const t = await getTranslations("services");

  const serviceItems = t.raw("items") as Array<{
    title: string;
    description: string;
    features: string[];
  }>;

  const services = [
    {
      icon: Dumbbell,
      ...serviceItems[0],
      image:
        "https://images.unsplash.com/photo-1758875569414-120ebc62ada3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluaW5nJTIwc2Vzc2lvbiUyMGd5bXxlbnwxfHx8fDE3Njk3MDUzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      icon: Users,
      ...serviceItems[1],
      image:
        "https://images.unsplash.com/photo-1758274539089-8b2bd10eee92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhbnNmb3JtYXRpb24lMjB3b3Jrb3V0fGVufDF8fHx8MTc2OTcwNTMwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      icon: Apple,
      ...serviceItems[2],
      image:
        "https://images.unsplash.com/photo-1587996580981-bd03dde74843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5YnVpbGRpbmclMjBudXRyaXRpb24lMjBtZWFsJTIwcHJlcHxlbnwxfHx8fDE3Njk3MDUzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      icon: Target,
      ...serviceItems[3],
      image:
        "https://images.unsplash.com/photo-1641134148191-f90cd3dede13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBib2R5YnVpbGRlciUyMGd5bSUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTcwNTMwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const processStepsData = t.raw("process.steps") as Array<{
    title: string;
    description: string;
  }>;

  const processSteps = [
    {
      icon: Calendar,
      ...processStepsData[0],
    },
    {
      icon: Target,
      ...processStepsData[1],
    },
    {
      icon: TrendingUp,
      ...processStepsData[2],
    },
  ];

  return (
    <section
      id="services"
      className="py-32 md:py-40 bg-gray-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-gray-600 font-medium text-sm uppercase tracking-wider">
            {t("tag")}
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl mt-4 mb-6 text-gray-900 tracking-tight">
            {t("title")}
            <br />
            <span className="text-gray-500">{t("titleAccent")}</span>
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-24">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-3">
                  <service.icon className="w-6 h-6 text-gray-900" />
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <div className="w-1 h-1 bg-gray-900 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                >
                  <Link href="/#contact">{t("learnMore")}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-16">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl text-center mb-4 text-gray-900 tracking-tight">
            {t("process.title")}
          </h3>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
            {t("process.description")}
          </p>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {processSteps.map((step, index) => (
              <div key={step.title} className="text-center relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gray-200" />
                )}

                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-3xl mb-6">
                  <step.icon className="w-9 h-9 text-white" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              className="h-auto w-full max-w-full whitespace-normal break-words text-center leading-snug sm:w-auto shadow-lg hover:shadow-xl"
            >
              <Link href="/#contact">{t("process.cta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
