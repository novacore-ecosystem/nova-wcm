"use client";

import { FormProvider, type FieldValues, type UseFormReturn } from "react-hook-form";
import type { ReactNode } from "react";

export interface FormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

export function Form<TFieldValues extends FieldValues>({ form, onSubmit, children, className }: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
