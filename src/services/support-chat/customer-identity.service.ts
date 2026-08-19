import type { CustomerIdentity } from "@/services/support-chat/support-chat.types";

/**
 * Resolves *who* is starting a conversation, before `supportChatService.createConversation` ever
 * runs — kept separate so the two identity flows (anonymous onboarding vs. authenticated
 * e-commerce customer) are each a single, obvious call site instead of ad-hoc logic scattered
 * across chat UI components.
 */
export const customerIdentityService = {
  /** Anonymous landing-page visitor who just completed the onboarding form (§5.1). */
  fromOnboarding(values: { name: string; email?: string; phone: string; address?: string }): CustomerIdentity {
    return { kind: "anonymous", name: values.name, email: values.email || undefined, phone: values.phone, address: values.address || undefined };
  },

  /**
   * Authenticated e-commerce customer flow (§5.2): would resolve identity from the storefront's
   * own auth session automatically, skipping the onboarding form entirely. No e-commerce
   * customer-auth exists anywhere in this app to resolve against, so this always returns `null`
   * rather than fabricating a logged-in customer — swap this body for a real lookup once one does.
   */
  async resolveAuthenticatedCustomer(): Promise<CustomerIdentity | null> {
    return null;
  },
};
