import { create } from "zustand";

const STORAGE_KEY = "nova-wcm.chat-owned-conversations";

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function persist(ids: string[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

interface ChatOwnershipState {
  ownedConversationIds: string[];
  markOwned: (conversationId: string) => void;
}

/**
 * Stands in for a "list conversations assigned to me" endpoint, which Chat Service doesn't
 * have — only `GET /conversation-queues/items` (Waiting items only, gone once claimed) and
 * get-by-id exist (see the backend audit). The Assigned tab hydrates each id here via
 * `getConversationDetail`, not a real list query.
 *
 * Populated when this browser session claims a conversation or accepts a handover invitation.
 * Known limitation, not fixable client-side: doesn't show conversations claimed from another
 * device/browser, or before this feature existed. A real backend endpoint is the actual fix —
 * documented as a gap, not worked around further.
 */
export const useChatOwnershipStore = create<ChatOwnershipState>((set, get) => ({
  ownedConversationIds: readStored(),
  markOwned: (conversationId) => {
    if (get().ownedConversationIds.includes(conversationId)) return;
    const next = [...get().ownedConversationIds, conversationId];
    persist(next);
    set({ ownedConversationIds: next });
  },
}));
