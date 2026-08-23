import { ContentWorkspace } from "@/features/content/components/ContentWorkspace";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentWorkspace contentId={id} />;
}
