"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HttpError } from "@novacore/frontend-foundation";
import { useTenantLoginConfiguration, type TenantOption } from "@novacore/frontend-next-shadcn";

import { useAppForm } from "@/shared/forms";
import { useLoginMutation } from "@/features/auth/api/auth.queries";
import { loginSchema, type LoginFormValues } from "@/features/auth/auth.schema";
import { tenantDirectoryService } from "@/features/auth/api/tenant-directory.service";
import { env } from "@/shared/lib/env";

export function useLoginPage() {
  const router = useRouter();
  const form = useAppForm(loginSchema, { defaultValues: { email: "", password: "" } });
  const loginMutation = useLoginMutation();
  const { configured: tenantConfigured } = useTenantLoginConfiguration(env.tenantClientKey);
  const [selectedTenant, setSelectedTenant] = useState<TenantOption | null>(null);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync({ values, tenantClientKey: tenantConfigured ? undefined : selectedTenant?.clientKey });
      router.replace("/");
    } catch {
      // surfaced via errorMessage below
    }
  };

  const errorMessage =
    loginMutation.error instanceof HttpError ? loginMutation.error.message : loginMutation.error ? "Login failed" : null;

  return {
    form,
    onSubmit,
    isSubmitting: loginMutation.isPending,
    errorMessage,
    tenantConfigured,
    tenantDirectoryService,
    selectedTenant,
    setSelectedTenant,
  };
}
