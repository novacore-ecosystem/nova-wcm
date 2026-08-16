"use client";

import { Info } from "lucide-react";
import { HowTo, PageContainer, PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { NavigationMenuEditor } from "@/features/website-navigation/components/WebsiteNavigationPage/NavigationMenuEditor";

export function WebsiteNavigationPage() {
  const { t } = useAppTranslation();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("websiteNavigation.title", "Điều hướng website")}
          description={t("websiteNavigation.description", "Sắp xếp các mục trong menu chính và menu chân trang của website.")}
        />

        <HowTo title={t("websiteNavigation.howTo.title", "Cách tổ chức menu website")} icon={<Info className="size-4" />}>
          {t(
            "websiteNavigation.howTo.body",
            "Giữ menu ở mức 5-7 mục để khách hàng dễ tìm — đặt những trang quan trọng nhất lên đầu.",
          )}
        </HowTo>

        <Tabs defaultValue="main">
          <TabsList>
            <TabsTrigger value="main">{t("websiteNavigation.tabMain", "Menu chính")}</TabsTrigger>
            <TabsTrigger value="footer">{t("websiteNavigation.tabFooter", "Menu chân trang")}</TabsTrigger>
          </TabsList>
          <TabsContent value="main">
            <NavigationMenuEditor menuId="main" />
          </TabsContent>
          <TabsContent value="footer">
            <NavigationMenuEditor menuId="footer" />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
