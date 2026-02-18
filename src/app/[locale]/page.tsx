import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Testimonials } from "@/components/sections/Testimonials";

export const dynamic = "force-static";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />

      <main>
        <Hero locale={locale} />
        <Journey />
        <About />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
