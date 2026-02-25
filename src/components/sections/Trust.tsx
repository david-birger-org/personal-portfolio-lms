import { BadgeCheck, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Trust() {
  const t = await getTranslations("hero");
  const authorityItems = [
    { icon: ShieldCheck, label: t("trust.president"), key: "president" },
    {
      icon: BadgeCheck,
      label: t("trust.certification"),
      key: "certification",
    },
  ];
  const metricCards = [
    { value: "300+", label: t("stats.clients") },
    { value: "10+", label: t("stats.experience") },
    { value: "98%", label: t("stats.success") },
  ];

  return (
    <section
      id="trust"
      className="relative overflow-hidden bg-linear-to-b from-white via-slate-50/60 to-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="pointer-events-none absolute -top-20 left-1/4 h-56 w-56 rounded-full bg-blue-100/55 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-1/4 h-48 w-48 rounded-full bg-cyan-100/45 blur-3xl" />

      <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/70 bg-white/55 p-5 text-slate-900 shadow-[0_25px_70px_-36px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/60 backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-white/55 via-white/20 to-blue-50/35" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-blue-300/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-linear-to-r from-transparent via-blue-300/80 to-transparent" />

        <div className="relative space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 gap-5 text-center sm:grid-cols-2 sm:gap-8">
            {authorityItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className="flex flex-col items-center gap-2.5"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blue-200/80 bg-white/70 text-blue-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-lg font-semibold text-slate-900 sm:text-xl lg:text-2xl">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-slate-300/90 to-transparent" />

          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-8">
            {metricCards.map((card) => (
              <div key={card.label} className="relative">
                <div className="text-5xl font-semibold tracking-tight text-blue-600 sm:text-6xl">
                  {card.value}
                </div>
                <p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl lg:text-2xl">
                  {card.label}
                </p>
                <div className="pointer-events-none absolute -right-4 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-linear-to-b from-transparent via-slate-300/70 to-transparent sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
