export type ConversationStatus = "unassigned" | "assigned" | "closed";
export type MessageSender = "customer" | "agent" | "ai" | "system";

export interface ConversationMessage {
  id: string;
  sender: MessageSender;
  senderName?: string;
  body: string;
  sentAt: string;
}

/**
 * A customer conversation started from the (future) landing-page chat widget. `assignedAgentId`
 * models the pool → pick → own workflow: null means it's sitting in the unassigned pool, set means
 * a staff member has claimed it. Routing strategy (skill-based, round-robin, AI routing, ...) is
 * intentionally not modeled — the pool + manual "assign to me" is the only strategy this UI
 * demonstrates, per the task's "don't invent backend logic that doesn't exist" boundary.
 */
export interface Conversation {
  id: string;
  customerName: string;
  customerEmail?: string;
  status: ConversationStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  unreadCount: number;
  messages: ConversationMessage[];
}
