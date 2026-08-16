import { getCurrentUser, login, logout, refreshToken, type LoginRequestDto } from "@/services/auth";
import type { LoginFormValues } from "@/features/auth/auth.schema";

export const authService = {
  async login(values: LoginFormValues) {
    const request: LoginRequestDto = { email: values.email, password: values.password };
    await login(request);
    return getCurrentUser();
  },
  async logout() {
    await logout();
  },
  /** Resolves the current session, or null if none exists. Never throws. */
  async bootstrapSession() {
    try {
      await refreshToken();
      return await getCurrentUser();
    } catch {
      return null;
    }
  },
};
