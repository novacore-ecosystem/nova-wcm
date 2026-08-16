"use client";

import { useRouter } from "next/navigation";
import { HttpError } from "@novacore/frontend-foundation";

import { useAppForm } from "@/shared/forms";
import { useLoginMutation } from "@/features/auth/api/auth.queries";
import { loginSchema, type LoginFormValues } from "@/features/auth/auth.schema";

export function useLoginPage() {
  const router = useRouter();
  const form = useAppForm(loginSchema, { defaultValues: { email: "", password: "" } });
  const loginMutation = useLoginMutation();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values);
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
  };
}
