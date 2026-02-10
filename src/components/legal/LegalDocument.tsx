import { ArrowLeft } from "lucide-react";
import type { LegalDoc, LegalUiStrings } from "@/content/legal";
import { Link } from "@/i18n/routing";

type Props = {
  ui: LegalUiStrings;
  doc: LegalDoc;
};

export function LegalDocument({ ui, doc }: Props) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white pt-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 h-64 w-[44rem] -translate-x-1/2 rounded-full bg-gray-900/5 blur-3xl" />
          <div className="absolute -bottom-36 left-1/2 h-64 w-[44rem] -translate-x-1/2 rounded-full bg-gray-900/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/#home"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui.backToHome}
          </Link>

          <div className="mt-6 pb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              {doc.title}
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              {ui.lastUpdatedLabel}: {doc.lastUpdated}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4 text-gray-800 leading-relaxed">
            {doc.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-10 space-y-10">
            {doc.sections.map((section) => (
              <section key={section.heading} className="scroll-mt-28">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  {section.heading}
                </h2>

                {section.paragraphs?.length ? (
                  <div className="mt-3 space-y-3 text-gray-800 leading-relaxed">
                    {section.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                ) : null}

                {section.bullets?.length ? (
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-800">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
