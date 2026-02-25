import { ImageIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CONTACT_FORM_HREF } from "@/constants/links";
import { Link } from "@/i18n/routing";

export async function Services() {
  const t = await getTranslations("services");
  const items = t.raw("items") as Array<{
    title: string;
    description: string;
    features: string[];
  }>;
  const getPreview = (description: string) => {
    const firstPart = description.split(/[.!?]/)[0]?.trim();

    if (!firstPart) {
      return description;
    }

    return `${firstPart}.`;
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gray-50 py-20 md:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag={t("tag")}
          title={t("title")}
          titleAccent={t("titleAccent")}
          description={t("description")}
          className="mb-12 md:mb-16"
        />

        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 md:gap-6">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.35)] md:p-6"
            >
              <div className="mb-5 flex aspect-[16/10] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Photo Placeholder
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {getPreview(item.description)}
              </p>

              <div className="mt-5">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {t("learnMore")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                      <DialogDescription>{item.description}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 pt-2">
                      {item.features.map((feature) => (
                        <p
                          key={`${item.title}-${feature}`}
                          className="text-sm text-gray-700"
                        >
                          - {feature}
                        </p>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Button asChild className="w-full sm:w-auto">
                        <Link href={CONTACT_FORM_HREF}>{t("process.cta")}</Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
