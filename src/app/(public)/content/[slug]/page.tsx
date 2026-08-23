import { PublishedContentPage } from "@/features/content/components/PublishedContentPage";

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  return <PublishedContentPage slug={slug} language={lang} />;
}
