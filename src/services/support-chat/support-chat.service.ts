import { paginateBackward, paginateForward, type CursorPage } from "@/shared/lib/mock/cursorPagination";
import { simulateLatency } from "@/shared/lib/mock/simulateLatency";
import type {
  AiModeConfig,
  Conversation,
  ConversationMessage,
  ConversationPriority,
  CustomerIdentity,
  HandoverRequest,
  SupportAgent,
} from "@/services/support-chat/support-chat.types";

const AGENTS: SupportAgent[] = [
  { id: "root", name: "Root" },
  { id: "agent-linh", name: "Diệu Linh" },
  { id: "agent-tuan", name: "Anh Tuấn" },
  { id: "agent-hoa", name: "Minh Hòa" },
];

function noAiMode(): AiModeConfig {
  return { state: "disabled", skills: [] };
}

function customer(kind: CustomerIdentity["kind"], name: string, extra: Partial<CustomerIdentity> = {}): CustomerIdentity {
  return { kind, name, ...extra };
}

function genMessages(conversationId: string, count: number, baseIso: string): ConversationMessage[] {
  const base = new Date(baseIso).getTime();
  const scripted = [
    "Chào shop, mình cần hỗ trợ thêm ạ.",
    "Sản phẩm này còn màu khác không shop?",
    "Cho mình hỏi về thời gian giao hàng với.",
    "Mình có thể xem thêm ảnh thực tế không?",
    "Giá này đã bao gồm vận chuyển chưa shop?",
  ];
  return Array.from({ length: count }, (_, index) => ({
    id: `${conversationId}-m${index + 1}`,
    sender: index % 4 === 3 ? "agent" : "customer",
    senderName: index % 4 === 3 ? "Root" : undefined,
    body: index % 4 === 3 ? "Dạ shop đã ghi nhận, sẽ phản hồi sớm nhất ạ." : scripted[index % scripted.length],
    sentAt: new Date(base + index * 60_000).toISOString(),
  }));
}

let conversations: Conversation[] = [
  {
    id: "conv-1",
    customer: customer("anonymous", "Chị Ngọc Anh", { email: "ngocanh.tran@gmail.com", phone: "0901 234 567" }),
    status: "unassigned",
    priority: "urgent",
    unreadCount: 2,
    aiMode: noAiMode(),
    createdAt: "2026-08-18T09:12:00+07:00",
    updatedAt: "2026-08-18T09:14:00+07:00",
  },
  {
    id: "conv-2",
    customer: customer("anonymous", "Anh Hoàng Phúc", { email: "phuc.hoang@gmail.com" }),
    status: "unassigned",
    priority: "normal",
    unreadCount: 1,
    aiMode: noAiMode(),
    createdAt: "2026-08-18T10:02:00+07:00",
    updatedAt: "2026-08-18T10:02:00+07:00",
  },
  {
    id: "conv-3",
    customer: customer("known", "Chị Thanh Mai", { email: "thanhmai89@gmail.com", phone: "0912 345 678" }),
    status: "assigned",
    assignedAgentId: "root",
    assignedAgentName: "Root",
    priority: "high",
    unreadCount: 0,
    aiMode: noAiMode(),
    createdAt: "2026-08-17T14:00:00+07:00",
    updatedAt: "2026-08-17T14:06:00+07:00",
  },
  {
    id: "conv-4",
    customer: customer("anonymous", "Anh Đức Thịnh", { phone: "0987 654 321" }),
    status: "assigned",
    assignedAgentId: "root",
    assignedAgentName: "Root",
    priority: "important",
    unreadCount: 1,
    aiMode: { state: "holding", skills: ["General FAQ", "Product information"], context: "Khách hỏi về chính sách bảo hành, chỉ trả lời thông tin chung.", enabledAt: "2026-08-18T08:30:20+07:00" },
    createdAt: "2026-08-18T08:30:00+07:00",
    updatedAt: "2026-08-18T08:32:00+07:00",
  },
  {
    id: "conv-5",
    customer: customer("known", "Chị Bích Ngọc", { email: "bichngoc@gmail.com" }),
    status: "closed",
    assignedAgentId: "root",
    assignedAgentName: "Root",
    priority: "normal",
    unreadCount: 0,
    aiMode: noAiMode(),
    createdAt: "2026-08-10T11:00:00+07:00",
    updatedAt: "2026-08-11T09:00:00+07:00",
  },
  {
    id: "conv-6",
    customer: customer("anonymous", "Anh Quang Huy"),
    status: "unassigned",
    priority: "normal",
    unreadCount: 1,
    aiMode: noAiMode(),
    createdAt: "2026-08-18T11:20:00+07:00",
    updatedAt: "2026-08-18T11:20:00+07:00",
  },
  {
    id: "conv-7",
    customer: customer("authenticated", "Trần Gia Bảo", { email: "giabao.tran@gmail.com", phone: "0977 111 222", accountId: "acct-8841" }),
    status: "assigned",
    assignedAgentId: "agent-linh",
    assignedAgentName: "Diệu Linh",
    priority: "urgent",
    unreadCount: 0,
    aiMode: noAiMode(),
    pendingHandover: {
      id: "handover-1",
      fromAgentId: "agent-linh",
      fromAgentName: "Diệu Linh",
      toAgentId: "root",
      toAgentName: "Root",
      reason: "Mình đang bận với một ca khác — bạn có thể tiếp nhận giúp mình, khách đang cần gấp thông tin đơn hàng.",
      requestedAt: "2026-08-18T13:40:00+07:00",
      status: "pending",
    },
    createdAt: "2026-08-18T13:00:00+07:00",
    updatedAt: "2026-08-18T13:40:00+07:00",
  },
  {
    id: "conv-8",
    customer: customer("anonymous", "Chị Kim Yến"),
    status: "unassigned",
    priority: "high",
    unreadCount: 3,
    aiMode: noAiMode(),
    createdAt: "2026-08-19T07:50:00+07:00",
    updatedAt: "2026-08-19T07:55:00+07:00",
  },
  {
    id: "conv-9",
    customer: customer("known", "Anh Việt Cường", { phone: "0933 222 111" }),
    status: "closed",
    assignedAgentId: "agent-tuan",
    assignedAgentName: "Anh Tuấn",
    priority: "high",
    unreadCount: 0,
    aiMode: noAiMode(),
    createdAt: "2026-08-05T10:00:00+07:00",
    updatedAt: "2026-08-05T10:40:00+07:00",
  },
  {
    id: "conv-10",
    customer: customer("anonymous", "Chị Phương Thảo"),
    status: "unassigned",
    priority: "normal",
    unreadCount: 1,
    aiMode: noAiMode(),
    createdAt: "2026-08-19T08:10:00+07:00",
    updatedAt: "2026-08-19T08:10:00+07:00",
  },
  {
    id: "conv-11",
    customer: customer("anonymous", "Anh Bảo Long"),
    status: "assigned",
    assignedAgentId: "agent-hoa",
    assignedAgentName: "Minh Hòa",
    priority: "normal",
    unreadCount: 0,
    aiMode: noAiMode(),
    createdAt: "2026-08-14T09:00:00+07:00",
    updatedAt: "2026-08-14T09:20:00+07:00",
  },
  {
    id: "conv-12",
    customer: customer("anonymous", "Chị Hạ Vy"),
    status: "unassigned",
    priority: "important",
    unreadCount: 2,
    aiMode: noAiMode(),
    createdAt: "2026-08-19T06:30:00+07:00",
    updatedAt: "2026-08-19T06:35:00+07:00",
  },
];

const messagesByConversation: Record<string, ConversationMessage[]> = {
  "conv-1": [
    { id: "conv-1-m1", sender: "customer", body: "Chào shop, bàn ăn gỗ sồi 6 chỗ còn hàng màu nâu sáng không ạ?", sentAt: "2026-08-18T09:12:00+07:00" },
    { id: "conv-1-m2", sender: "system", body: "Cuộc trò chuyện bắt đầu từ chat trên trang chủ.", sentAt: "2026-08-18T09:12:00+07:00" },
    { id: "conv-1-m3", sender: "customer", body: "Em muốn hỏi thêm về thời gian giao hàng nữa ạ.", sentAt: "2026-08-18T09:14:00+07:00" },
  ],
  "conv-2": [{ id: "conv-2-m1", sender: "customer", body: "Sofa vải xám trong ảnh trên fanpage có giao đến Cần Thơ không shop?", sentAt: "2026-08-18T10:02:00+07:00" }],
  "conv-3": genMessages("conv-3", 26, "2026-08-17T14:00:00+07:00"),
  "conv-4": [
    { id: "conv-4-m1", sender: "customer", body: "Tủ quần áo 3 cánh có bảo hành bao lâu ạ?", sentAt: "2026-08-18T08:30:00+07:00" },
    { id: "conv-4-m2", sender: "ai", body: "Sản phẩm tủ quần áo 3 cánh gỗ công nghiệp được bảo hành 24 tháng theo chính sách hiện hành.", sentAt: "2026-08-18T08:30:20+07:00" },
    { id: "conv-4-m3", sender: "customer", body: "Nếu bị bung bản lề trong thời gian bảo hành thì sao ạ?", sentAt: "2026-08-18T08:32:00+07:00" },
    { id: "conv-4-m4", sender: "ai", body: "Tư vấn viên đang hỗ trợ yêu cầu của bạn. Vui lòng chờ trong ít phút để được xử lý cụ thể hơn ạ.", sentAt: "2026-08-18T08:32:15+07:00" },
  ],
  "conv-5": [
    { id: "conv-5-m1", sender: "customer", body: "Em muốn đổi trả ghế làm việc ErgoFlex vì không vừa.", sentAt: "2026-08-10T11:00:00+07:00" },
    { id: "conv-5-m2", sender: "agent", senderName: "Root", body: "Dạ shop đã tiếp nhận yêu cầu đổi trả, nhân viên sẽ liên hệ chị trong hôm nay ạ.", sentAt: "2026-08-10T11:10:00+07:00" },
    { id: "conv-5-m3", sender: "system", body: "Cuộc trò chuyện đã được đóng.", sentAt: "2026-08-11T09:00:00+07:00" },
  ],
  "conv-6": [{ id: "conv-6-m1", sender: "customer", body: "Showroom Quận 1 mở cửa đến mấy giờ vậy shop?", sentAt: "2026-08-18T11:20:00+07:00" }],
  "conv-7": [
    { id: "conv-7-m1", sender: "customer", body: "Đơn hàng #NW-4821 của em khi nào giao vậy shop?", sentAt: "2026-08-18T13:00:00+07:00" },
    { id: "conv-7-m2", sender: "agent", senderName: "Diệu Linh", body: "Chào anh, để em kiểm tra lại đơn hàng giúp anh nhé.", sentAt: "2026-08-18T13:05:00+07:00" },
    { id: "conv-7-m3", sender: "system", body: "Diệu Linh đã yêu cầu chuyển giao cuộc trò chuyện này cho Root.", sentAt: "2026-08-18T13:40:00+07:00" },
  ],
  "conv-8": [
    { id: "conv-8-m1", sender: "customer", body: "Mình đặt hàng hôm qua mà chưa thấy xác nhận ạ.", sentAt: "2026-08-19T07:50:00+07:00" },
    { id: "conv-8-m2", sender: "customer", body: "Shop kiểm tra giúp mình với.", sentAt: "2026-08-19T07:53:00+07:00" },
    { id: "conv-8-m3", sender: "customer", body: "Mình cần gấp ạ.", sentAt: "2026-08-19T07:55:00+07:00" },
  ],
  "conv-9": [
    { id: "conv-9-m1", sender: "customer", body: "Kệ sách gỗ thông có đóng gói cẩn thận không shop?", sentAt: "2026-08-05T10:00:00+07:00" },
    { id: "conv-9-m2", sender: "agent", senderName: "Anh Tuấn", body: "Dạ shop đóng gói kỹ bằng bọt xốp và thùng carton cứng ạ.", sentAt: "2026-08-05T10:20:00+07:00" },
    { id: "conv-9-m3", sender: "system", body: "Cuộc trò chuyện đã được đóng.", sentAt: "2026-08-05T10:40:00+07:00" },
  ],
  "conv-10": [{ id: "conv-10-m1", sender: "customer", body: "Đèn trần phòng khách còn hàng không shop?", sentAt: "2026-08-19T08:10:00+07:00" }],
  "conv-11": [
    { id: "conv-11-m1", sender: "customer", body: "Giường ngủ 1m8 có sẵn giao trong tuần này không ạ?", sentAt: "2026-08-14T09:00:00+07:00" },
    { id: "conv-11-m2", sender: "agent", senderName: "Minh Hòa", body: "Dạ có sẵn, shop giao trong 2-3 ngày ạ.", sentAt: "2026-08-14T09:20:00+07:00" },
  ],
  "conv-12": [
    { id: "conv-12-m1", sender: "customer", body: "Thảm trải sàn kích thước lớn nhất là bao nhiêu vậy shop?", sentAt: "2026-08-19T06:30:00+07:00" },
    { id: "conv-12-m2", sender: "customer", body: "Mình cần loại 2m x 3m ạ.", sentAt: "2026-08-19T06:35:00+07:00" },
  ],
};

for (const conversation of conversations) {
  const messages = messagesByConversation[conversation.id];
  const last = messages?.[messages.length - 1];
  if (last) {
    conversation.lastMessagePreview = last.body;
    conversation.lastMessageSender = last.sender;
  }
}

const PRIORITY_RANK: Record<ConversationPriority, number> = { urgent: 0, high: 1, important: 2, normal: 3 };

/**
 * Open conversations always rank above closed ones; priority breaks ties within each group;
 * most-recently-updated breaks remaining ties. Priority stays attached to the conversation object
 * itself, so it survives assignment/handover changes with no extra bookkeeping.
 */
function compareConversations(a: Conversation, b: Conversation): number {
  const aOpen = a.status === "closed" ? 1 : 0;
  const bOpen = b.status === "closed" ? 1 : 0;
  if (aOpen !== bOpen) return aOpen - bOpen;
  const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (priorityDiff !== 0) return priorityDiff;
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function matchesKeyword(conversation: Conversation, keyword: string): boolean {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return true;
  return [conversation.customer.name, conversation.customer.email, conversation.customer.phone].some((field) => field?.toLowerCase().includes(needle));
}

export type ConversationListTab = "unassigned" | "assigned";

export const supportChatService = {
  async listConversations(params: { tab: ConversationListTab; keyword?: string; cursor?: string | null; limit: number }): Promise<CursorPage<Conversation>> {
    const matched = conversations
      .filter((c) => (params.tab === "unassigned" ? c.status === "unassigned" : c.status !== "unassigned"))
      .filter((c) => matchesKeyword(c, params.keyword ?? ""))
      .sort(compareConversations);
    return paginateForward(matched, { cursor: params.cursor, limit: params.limit });
  },

  async getConversation(id: string): Promise<Conversation> {
    const found = conversations.find((c) => c.id === id);
    await simulateLatency(undefined);
    if (!found) throw new Error(`Conversation "${id}" was not found.`);
    return found;
  },

  async listMessages(conversationId: string, params: { cursor?: string | null; limit: number }): Promise<CursorPage<ConversationMessage>> {
    const all = messagesByConversation[conversationId] ?? [];
    return paginateBackward(all, { cursor: params.cursor, limit: params.limit });
  },

  async listAgents(): Promise<SupportAgent[]> {
    return simulateLatency(AGENTS, 100, 250);
  },

  /**
   * Handover requests targeting `agentId`, regardless of the conversation's own status — a
   * pending handover is shown to its *recipient* as an inbound request at the top of their
   * Unassigned view even though the conversation is technically still "assigned" to the sender
   * until accepted. Small/non-paginated: an individual consultant's inbox of open requests.
   */
  async listPendingHandoversFor(agentId: string): Promise<Conversation[]> {
    const matched = conversations.filter((c) => c.pendingHandover?.status === "pending" && c.pendingHandover.toAgentId === agentId);
    return simulateLatency(matched, 150, 350);
  },

  /**
   * Replying to an unassigned conversation *is* taking ownership of it — this is the one place
   * that auto-assignment happens, so the UI never needs a separate "assign" step before a first
   * reply. `autoAssigned` tells the caller whether that transition just occurred, so it can drive
   * the tab-switch + focus UX.
   */
  async sendMessage(conversationId: string, message: { agentId: string; agentName: string; body: string }): Promise<{ conversation: Conversation; message: ConversationMessage; autoAssigned: boolean }> {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) throw new Error(`Conversation "${conversationId}" was not found.`);

    const autoAssigned = conversation.status === "unassigned";
    const now = new Date().toISOString();
    const newMessage: ConversationMessage = { id: `${conversationId}-m-${crypto.randomUUID()}`, sender: "agent", senderName: message.agentName, body: message.body, sentAt: now };
    messagesByConversation[conversationId] = [...(messagesByConversation[conversationId] ?? []), newMessage];

    conversation.updatedAt = now;
    conversation.lastMessagePreview = newMessage.body;
    conversation.lastMessageSender = newMessage.sender;
    if (autoAssigned) {
      conversation.status = "assigned";
      conversation.assignedAgentId = message.agentId;
      conversation.assignedAgentName = message.agentName;
    }
    if (conversation.aiMode.state === "holding") conversation.aiMode = { ...conversation.aiMode, state: "humanActive" };

    await simulateLatency(undefined, 150, 350);
    return { conversation: { ...conversation }, message: newMessage, autoAssigned };
  },

  async setPriority(conversationId: string, priority: ConversationPriority): Promise<Conversation> {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) throw new Error(`Conversation "${conversationId}" was not found.`);
    conversation.priority = priority;
    conversation.updatedAt = new Date().toISOString();
    return simulateLatency({ ...conversation });
  },

  async closeConversation(conversationId: string): Promise<Conversation> {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) throw new Error(`Conversation "${conversationId}" was not found.`);
    conversation.status = "closed";
    conversation.updatedAt = new Date().toISOString();
    return simulateLatency({ ...conversation });
  },

  async requestHandover(conversationId: string, input: { fromAgentId: string; fromAgentName: string; toAgentId: string; toAgentName: string; reason?: string }): Promise<Conversation> {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) throw new Error(`Conversation "${conversationId}" was not found.`);
    const request: HandoverRequest = { id: `handover-${crypto.randomUUID()}`, ...input, requestedAt: new Date().toISOString(), status: "pending" };
    conversation.pendingHandover = request;
    conversation.updatedAt = request.requestedAt;
    return simulateLatency({ ...conversation });
  },

  async acceptHandover(conversationId: string): Promise<Conversation> {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation?.pendingHandover) throw new Error(`Conversation "${conversationId}" has no pending handover.`);
    conversation.assignedAgentId = conversation.pendingHandover.toAgentId;
    conversation.assignedAgentName = conversation.pendingHandover.toAgentName;
    conversation.status = "assigned";
    conversation.pendingHandover = undefined;
    conversation.updatedAt = new Date().toISOString();
    return simulateLatency({ ...conversation });
  },

  async rejectHandover(conversationId: string): Promise<Conversation> {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation?.pendingHandover) throw new Error(`Conversation "${conversationId}" has no pending handover.`);
    conversation.pendingHandover = { ...conversation.pendingHandover, status: "rejected" };
    conversation.updatedAt = new Date().toISOString();
    const resolved = { ...conversation };
    conversation.pendingHandover = undefined;
    return simulateLatency(resolved);
  },

  async setAiMode(conversationId: string, config: AiModeConfig): Promise<Conversation> {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) throw new Error(`Conversation "${conversationId}" was not found.`);
    conversation.aiMode = config;
    conversation.updatedAt = new Date().toISOString();
    return simulateLatency({ ...conversation });
  },

  /** Landing-page entry point: an anonymous visitor who just completed the onboarding form (or an authenticated customer auto-mapped) starts a brand-new unassigned conversation. */
  async createConversation(identity: CustomerIdentity): Promise<Conversation> {
    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: `conv-${crypto.randomUUID()}`,
      customer: identity,
      status: "unassigned",
      priority: "normal",
      unreadCount: 1,
      aiMode: noAiMode(),
      createdAt: now,
      updatedAt: now,
      lastMessagePreview: "Cuộc trò chuyện bắt đầu từ chat trên trang chủ.",
      lastMessageSender: "system",
    };
    conversations = [conversation, ...conversations];
    messagesByConversation[conversation.id] = [
      { id: `${conversation.id}-m1`, sender: "system", body: "Cuộc trò chuyện bắt đầu từ chat trên trang chủ.", sentAt: now },
    ];
    return simulateLatency(conversation);
  },
};
