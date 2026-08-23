"use client";

/**
 * TEMPORARY — dev/test-only stand-in for the real landing-page chat widget, which doesn't exist
 * yet (no public storefront in this repo). Exercises the real Chat Service guest flow
 * (`POST /guests/conversations` → `POST /conversations/{id}/messages`) so a real conversation
 * shows up in the admin `ChatWorkspace` (`features/support-chat`) to verify against.
 *
 * Deliberately isolated: this file + its one mount line in `src/app/layout.tsx` is the entire
 * footprint. No shared domain/state/abstraction was added to support it, and it does not import
 * anything from `features/support-chat` or vice versa — deleting both is the whole removal.
 *
 * Deliberately minimal per the task spec: no message history is read or rendered here (the point
 * is only to *produce* real guest activity for the admin side to observe), no typing indicators,
 * no bubbles — a button, a tiny creation form, and a single text input.
 *
 * Auth: does NOT use the shared `httpClient`/`fetch` machinery `services/support-chat` uses
 * (cookie-based, `withCredentials: true`) — reusing that here would let a guest's
 * `Set-Cookie: AccessToken` response clobber an admin's own session cookie on the same origin,
 * since Chat Service's guest and staff JWTs share one cookie name (see the backend audit's auth
 * note). Instead the guest access token from `StartGuestConversationResponse.AccessToken` is kept
 * in `localStorage` and sent explicitly as `Authorization: Bearer <token>` on every request, with
 * `credentials: "omit"` so no cookie is ever read or written by this component.
 */

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button, Input, Textarea } from "@novacore/frontend-next-shadcn";

import { env } from "@/shared/lib/env";

const STORAGE_KEY = "nova-wcm.guest-chat";
const CHAT_BASE = `${env.apiBaseUrl}/chat`;

interface StoredGuestSession {
  conversationId: string;
  accessToken: string;
}

function readStoredSession(): StoredGuestSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredGuestSession) : null;
  } catch {
    return null;
  }
}

function persistSession(session: StoredGuestSession | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(STORAGE_KEY);
}

/** No `unwrapApiResponse` reuse — deliberately not importing `shared/lib/api/client` (see the isolation note above); this is the whole envelope-unwrap this component needs. */
async function guestFetch<T>(path: string, options: { method: "GET" | "POST"; token?: string; body?: unknown }): Promise<T> {
  const response = await fetch(`${CHAT_BASE}${path}`, {
    method: options.method,
    credentials: "omit",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) throw new Error(`Chat Service request failed (${response.status})`);
  const envelope = (await response.json()) as { success: boolean; message: string; data: T };
  if (!envelope.success) throw new Error(envelope.message || "Chat Service request failed");
  return envelope.data;
}

type WidgetState = "closed" | "creating" | "chatting";

export function GuestChatWidget() {
  const [state, setState] = useState<WidgetState>("closed");
  const [session, setSession] = useState<StoredGuestSession | null>(null);
  const [checkingRecovery, setCheckingRecovery] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // On mount: recover a stored guest session via GET /conversations/{id}/status (the backend's
  // actual recovery mechanism, see the audit) — never invent a separate client-side protocol.
  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) {
      setCheckingRecovery(false);
      return;
    }
    guestFetch<{ status: number }>(`/conversations/${stored.conversationId}/status`, { method: "GET", token: stored.accessToken })
      .then((status) => {
        const CLOSED = 4;
        if (status.status === CLOSED) {
          persistSession(null);
          setSession(null);
        } else {
          setSession(stored);
        }
      })
      .catch(() => {
        persistSession(null);
        setSession(null);
      })
      .finally(() => setCheckingRecovery(false));
  }, []);

  useEffect(() => {
    if (state === "chatting") inputRef.current?.focus();
  }, [state]);

  async function submitCreateForm() {
    if (!displayName.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    setIsCreating(true);
    setError(null);
    try {
      const response = await guestFetch<{ contactId: string; conversationId: string; accessToken: string }>("/guests/conversations", {
        method: "POST",
        body: { displayName: displayName.trim(), email: email.trim() || undefined, phone: phone.trim() || undefined, reason: reason.trim() || undefined },
      });
      const next: StoredGuestSession = { conversationId: response.conversationId, accessToken: response.accessToken };
      persistSession(next);
      setSession(next);
      setState("chatting");
    } catch {
      setError("Couldn't start a conversation. Is the Chat Service running and its DEFAULT queue seeded?");
    } finally {
      setIsCreating(false);
    }
  }

  async function sendMessage() {
    const content = draft.trim();
    if (!content || !session) return;
    setIsSending(true);
    setError(null);
    try {
      await guestFetch(`/conversations/${session.conversationId}/messages`, {
        method: "POST",
        token: session.accessToken,
        body: { clientMessageId: crypto.randomUUID(), type: 1, content, format: 1 },
      });
      setDraft("");
      setJustSent(true);
      setTimeout(() => setJustSent(false), 1500);
    } catch {
      setError("Message failed to send — your session may have expired.");
    } finally {
      setIsSending(false);
    }
  }

  if (checkingRecovery) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {state === "creating" ? (
        <div className="w-72 rounded-lg border border-border bg-card p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Start a chat</p>
            <Button variant="ghost" size="icon" className="size-6" onClick={() => setState("closed")}>
              <X className="size-3.5" />
            </Button>
          </div>
          <div className="grid gap-2">
            <Input placeholder="Your name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Textarea placeholder="What do you need help with? (optional)" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
            <Button size="sm" loading={isCreating} onClick={submitCreateForm}>
              Start chatting
            </Button>
          </div>
        </div>
      ) : null}

      {state === "chatting" && session ? (
        <div className="flex w-72 items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-lg">
          <Input
            ref={inputRef}
            placeholder="Type a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void sendMessage();
            }}
            disabled={isSending}
          />
          <Button size="icon" className="shrink-0" disabled={isSending || !draft.trim()} onClick={() => void sendMessage()} aria-label="Send">
            <Send className="size-4" />
          </Button>
        </div>
      ) : null}
      {state === "chatting" && error ? <p className="max-w-72 text-right text-xs text-destructive">{error}</p> : null}
      {state === "chatting" && justSent ? <p className="text-xs text-muted-foreground">Sent ✓</p> : null}

      <Button
        size="icon"
        className="size-12 rounded-full shadow-lg"
        onClick={() => setState((current) => (current === "closed" ? (session ? "chatting" : "creating") : "closed"))}
        aria-label="Chat with us"
      >
        <MessageCircle className="size-5" />
      </Button>
    </div>
  );
}
