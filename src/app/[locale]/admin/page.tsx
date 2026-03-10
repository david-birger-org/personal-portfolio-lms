import { getTranslations } from "next-intl/server";
import { AdminHeaderActions } from "@/components/admin/AdminHeaderActions";
import { MonobankInvoiceForm } from "@/components/admin/MonobankInvoiceForm";
import { MonobankPaymentsHistory } from "@/components/admin/MonobankPaymentsHistory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");

  return (
    <main className="container mx-auto max-w-5xl px-4 pb-10 pt-28 md:pt-32">
      <div className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">
              {t("eyebrow")}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-muted-foreground max-w-3xl text-sm">
              {t("description")}
            </p>
          </div>
          <AdminHeaderActions />
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">{t("tabs.general")}</TabsTrigger>
            <TabsTrigger value="payments">{t("tabs.payments")}</TabsTrigger>
            <TabsTrigger value="history">{t("tabs.history")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("signedIn.title")}</CardTitle>
                <CardDescription>{t("signedIn.description")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border p-4">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    {t("routeLabel")}
                  </p>
                  <p className="mt-2 font-mono text-sm">/{locale}/admin</p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    {t("sessionLabel")}
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {t("sessionSignedIn")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>{t("footer")}</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <MonobankInvoiceForm />
          </TabsContent>

          <TabsContent value="history">
            <MonobankPaymentsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
