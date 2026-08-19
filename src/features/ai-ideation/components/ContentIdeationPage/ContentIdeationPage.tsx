"use client";

import { Info, Lightbulb, Sparkles } from "lucide-react";
import { Badge, Button, Card, CardContent, FormField, FormSection, Input, PageContainer, PageHeader, Textarea } from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useContentIdeationPage } from "@/features/ai-ideation/components/ContentIdeationPage/useContentIdeationPage";

export function ContentIdeationPage() {
  const { t } = useAppTranslation();
  const { form, onSubmit, state } = useContentIdeationPage();
  const { register } = form;

  return (
    <PageContainer>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <PageHeader
          title={t("aiIdeation.title", "Content ideation")}
          description={t("aiIdeation.description", "Describe what you're trying to achieve — get title, angle, and outline suggestions before you start writing.")}
        />

        <Form form={form} onSubmit={onSubmit} className="grid gap-6">
          <FormSection title={t("aiIdeation.brief", "Brief")}>
            <FormField label={t("aiIdeation.objective", "Business objective")} htmlFor="objective" required error={form.formState.errors.objective?.message}>
              <Input id="objective" placeholder={t("aiIdeation.objectivePlaceholder", "e.g. Drive showroom visits for the autumn collection")} {...register("objective")} />
            </FormField>
            <FormField label={t("aiIdeation.topic", "Topic")} htmlFor="topic" required error={form.formState.errors.topic?.message}>
              <Input id="topic" {...register("topic")} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("aiIdeation.audience", "Target audience")} htmlFor="audience">
                <Input id="audience" {...register("audience")} />
              </FormField>
              <FormField label={t("aiIdeation.keywords", "Keywords")} htmlFor="keywords">
                <Input id="keywords" {...register("keywords")} />
              </FormField>
              <FormField label={t("aiIdeation.tone", "Tone")} htmlFor="tone">
                <Input id="tone" placeholder={t("aiIdeation.tonePlaceholder", "e.g. Warm, practical")} {...register("tone")} />
              </FormField>
              <FormField label={t("aiIdeation.contentType", "Content type")} htmlFor="contentType">
                <Input id="contentType" placeholder={t("aiIdeation.contentTypePlaceholder", "e.g. Blog post, buying guide")} {...register("contentType")} />
              </FormField>
            </div>
            <FormField label={t("aiIdeation.constraints", "Constraints / requirements")} htmlFor="constraints">
              <Textarea id="constraints" rows={2} {...register("constraints")} />
            </FormField>
          </FormSection>

          <Button type="submit" loading={state.status === "loading"} className="self-start">
            <Sparkles className="mr-2 size-4" />
            {t("aiIdeation.generate", "Generate ideas")}
          </Button>
        </Form>

        {state.status === "notConfigured" ? (
          <Card className="border-dashed">
            <CardContent className="flex items-start gap-3 pt-6 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">
                {t(
                  "aiIdeation.notConfigured",
                  "This module is wired up end-to-end, but no AI Service is connected for this tenant yet. Once one is, submitting a brief here will return real ideas.",
                )}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {state.status === "error" ? (
          <Card className="border-destructive/50">
            <CardContent className="pt-6 text-sm text-destructive">{state.message}</CardContent>
          </Card>
        ) : null}

        {state.status === "ready" ? (
          <div className="grid gap-4">
            {state.ideas.map((idea) => (
              <Card key={idea.title}>
                <CardContent className="grid gap-2 pt-6">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                    <h3 className="font-semibold">{idea.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{idea.angle}</p>
                  <ul className="ml-6 list-disc text-sm">
                    {idea.outline.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}
