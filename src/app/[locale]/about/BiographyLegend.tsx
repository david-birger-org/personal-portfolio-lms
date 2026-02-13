import type {
  BiographyLocale,
  BiographySectionData,
} from "@/app/[locale]/about/types";
import { MobileSectionLegend } from "@/components/sections/MobileSectionLegend";

function labelFor(locale: BiographyLocale) {
  return locale === "ua" ? "Легенда" : "Legend";
}

function navLabelFor(locale: BiographyLocale) {
  return locale === "ua" ? "Навігація розділами" : "Section navigation";
}

export function BiographyMobileLegend({
  sections,
  locale,
}: {
  sections: BiographySectionData[];
  locale: BiographyLocale;
}) {
  return (
    <MobileSectionLegend
      sections={sections.map((section) => ({
        id: section.id,
        title: section.title,
      }))}
      label={labelFor(locale)}
      ariaLabel={
        locale === "ua"
          ? "Мобільна навігація розділами"
          : "Mobile section navigation"
      }
    />
  );
}

export function BiographyDesktopLegend({
  sections,
  locale,
}: {
  sections: BiographySectionData[];
  locale: BiographyLocale;
}) {
  return (
    <aside className="hidden lg:sticky lg:top-28 lg:block">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
          {labelFor(locale)}
        </p>
        <nav aria-label={navLabelFor(locale)}>
          <ul className="space-y-1.5">
            {sections.map((section) => (
              <li key={`legend-${section.id}`}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-lg px-2 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
