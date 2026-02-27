import Image from "next/image";
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
import { cn } from "@/lib/utils";

export async function Services() {
  const t = await getTranslations("services");
  const productCards = [
    {
      src: "/images/product-1.jpg",
      imageClassName: "object-cover object-top",
    },
    {
      src: "/images/product-2.jpg",
      imageClassName: "object-cover object-top",
    },
    {
      src: "/images/product-3.jpg",
      imageClassName: "object-cover object-top md:object-top",
    },
    {
      src: "/images/product-4.jpg",
      imageClassName: "object-cover object-[center_25%] md:object-[center_15%]",
    },
    {
      src: "/images/product-5.jpg",
      imageClassName: "object-cover object-[center_53%] md:object-[center_25%]",
    },
  ] as const;
  const items = t.raw("items") as Array<{
    title: string;
    description: string;
    features: string[];
    forWho?: string[];
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
          {items.map((item, index) => {
            const productCard = productCards[index % productCards.length];
            const isUnpairedLastCard =
              items.length % 2 === 1 && index === items.length - 1;

            return (
              <Dialog key={item.title}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full cursor-pointer rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_15px_40px_-30px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_20px_48px_-28px_rgba(15,23,42,0.4)] focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none md:p-6",
                      isUnpairedLastCard &&
                        "md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)]",
                    )}
                  >
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                      <Image
                        src={productCard.src}
                        alt={item.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className={productCard.imageClassName}
                      />
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {getPreview(item.description)}
                    </p>

                    <div className="mt-5">
                      <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm">
                        {t("learnMore")}
                      </span>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <div className="space-y-4">
                    <DialogHeader className="gap-3 border-b border-slate-200/80 pb-4 pr-10">
                      <DialogTitle className="text-xl tracking-tight text-slate-900 sm:text-2xl">
                        {item.title}
                      </DialogTitle>
                      <DialogDescription className="text-sm leading-relaxed text-slate-600 sm:text-base">
                        {item.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[52vh] space-y-4 overflow-y-auto py-1 pr-1">
                      <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 sm:p-5">
                        <h4 className="mb-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                          {t("includesLabel")}
                        </h4>
                        <ul className="space-y-2.5">
                          {item.features.map((feature) => (
                            <li
                              key={`${item.title}-${feature}`}
                              className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                            >
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {item.forWho?.length ? (
                        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
                          <h4 className="mb-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                            {t("forWhoLabel")}
                          </h4>
                          <ul className="space-y-2.5">
                            {item.forWho.map((audience) => (
                              <li
                                key={`${item.title}-${audience}`}
                                className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                              >
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                                <span>{audience}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    <div className="border-t border-slate-200/80 pt-4">
                      <Button asChild className="w-full">
                        <Link href={CONTACT_FORM_HREF}>{t("process.cta")}</Link>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
    </section>
  );
}
