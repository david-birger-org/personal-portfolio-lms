import { Services } from "@/components/sections/Services";

export const dynamic = "force-static";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="bg-gray-100">
      <Services locale={locale} />
    </main>
  );
}
