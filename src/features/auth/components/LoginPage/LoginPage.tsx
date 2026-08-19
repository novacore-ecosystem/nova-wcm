"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, FormField, Input, PasswordInput, TenantSelector } from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useLoginPage } from "@/features/auth/components/LoginPage/useLoginPage";

export function LoginPage() {
  const { t } = useAppTranslation();
  const {
    form,
    onSubmit,
    isSubmitting,
    errorMessage,
    tenantConfigured,
    tenantDirectoryService,
    selectedTenant,
    setSelectedTenant,
  } = useLoginPage();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="mb-1 text-2xl">🧡</span>
          <CardTitle>{t("app.name", "Nova WCM")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("app.description", "Sign in to manage your website")}</p>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit} className="grid gap-4">
            {!tenantConfigured ? (
              <FormField label={t("auth.login.tenant", "Tenant")} htmlFor="tenant">
                <TenantSelector service={tenantDirectoryService} value={selectedTenant} onChange={setSelectedTenant} />
              </FormField>
            ) : null}
            <FormField label={t("auth.login.email", "Email")} htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" autoComplete="username" invalid={!!errors.email} {...register("email")} />
            </FormField>
            <FormField label={t("auth.login.password", "Password")} htmlFor="password" error={errors.password?.message}>
              <PasswordInput id="password" autoComplete="current-password" invalid={!!errors.password} {...register("password")} />
            </FormField>
            {errorMessage ? (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}
            <Button type="submit" loading={isSubmitting} className="w-full">
              {t("auth.login.submit", "Sign in")}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
