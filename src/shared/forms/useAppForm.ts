"use client";

import { useForm, type FieldValues, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, z } from "zod";

/** The one place business code touches react-hook-form/zod. */
export function useAppForm<TSchema extends ZodType<FieldValues>>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">,
) {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema as never) as UseFormProps<z.infer<TSchema>>["resolver"],
  });
}
