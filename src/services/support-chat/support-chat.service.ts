import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { createMockCollection } from "@/shared/lib/mock/mockCollection";
import type { Conversation } from "@/services/support-chat/support-chat.types";

const seed: Conversation[] = [
  {
    id: "conv-1",
    customerName: "Chị Ngọc Anh",
    customerEmail: "ngocanh.tran@gmail.com",
    status: "unassigned",
    unreadCount: 2,
    messages: [
      { id: "m1", sender: "customer", body: "Chào shop, bàn ăn gỗ sồi 6 chỗ còn hàng màu nâu sáng không ạ?", sentAt: "2026-08-18T09:12:00+07:00" },
      { id: "m2", sender: "system", body: "Cuộc trò chuyện bắt đầu từ chat trên trang chủ.", sentAt: "2026-08-18T09:12:00+07:00" },
      { id: "m3", sender: "customer", body: "Em muốn hỏi thêm về thời gian giao hàng nữa ạ.", sentAt: "2026-08-18T09:14:00+07:00" },
    ],
  },
  {
    id: "conv-2",
    customerName: "Anh Hoàng Phúc",
    customerEmail: "phuc.hoang@gmail.com",
    status: "unassigned",
    unreadCount: 1,
    messages: [{ id: "m1", sender: "customer", body: "Sofa vải xám trong ảnh trên fanpage có giao đến Cần Thơ không shop?", sentAt: "2026-08-18T10:02:00+07:00" }],
  },
  {
    id: "conv-3",
    customerName: "Chị Thanh Mai",
    status: "assigned",
    assignedAgentId: "root",
    assignedAgentName: "Root",
    unreadCount: 0,
    messages: [
      { id: "m1", sender: "customer", body: "Em đặt giường ngủ 1m8 hôm qua, khi nào ship ạ?", sentAt: "2026-08-17T14:00:00+07:00" },
      { id: "m2", sender: "agent", senderName: "Root", body: "Chào chị, đơn của chị dự kiến giao trong 3-5 ngày làm việc ạ.", sentAt: "2026-08-17T14:05:00+07:00" },
      { id: "m3", sender: "customer", body: "Dạ em cảm ơn shop!", sentAt: "2026-08-17T14:06:00+07:00" },
    ],
  },
  {
    id: "conv-4",
    customerName: "Anh Đức Thịnh",
    status: "assigned",
    assignedAgentId: "root",
    assignedAgentName: "Root",
    unreadCount: 1,
    messages: [
      { id: "m1", sender: "customer", body: "Tủ quần áo 3 cánh có bảo hành bao lâu ạ?", sentAt: "2026-08-18T08:30:00+07:00" },
      { id: "m2", sender: "ai", body: "Sản phẩm tủ quần áo 3 cánh gỗ công nghiệp được bảo hành 24 tháng theo chính sách hiện hành.", sentAt: "2026-08-18T08:30:20+07:00" },
      { id: "m3", sender: "customer", body: "Nếu bị bung bản lề trong thời gian bảo hành thì sao ạ?", sentAt: "2026-08-18T08:32:00+07:00" },
    ],
  },
  {
    id: "conv-5",
    customerName: "Chị Bích Ngọc",
    status: "closed",
    assignedAgentId: "root",
    assignedAgentName: "Root",
    unreadCount: 0,
    messages: [
      { id: "m1", sender: "customer", body: "Em muốn đổi trả ghế làm việc ErgoFlex vì không vừa.", sentAt: "2026-08-10T11:00:00+07:00" },
      { id: "m2", sender: "agent", senderName: "Root", body: "Dạ shop đã tiếp nhận yêu cầu đổi trả, nhân viên sẽ liên hệ chị trong hôm nay ạ.", sentAt: "2026-08-10T11:10:00+07:00" },
      { id: "m3", sender: "system", body: "Cuộc trò chuyện đã được đóng.", sentAt: "2026-08-11T09:00:00+07:00" },
    ],
  },
  {
    id: "conv-6",
    customerName: "Anh Quang Huy",
    status: "unassigned",
    unreadCount: 1,
    messages: [{ id: "m1", sender: "customer", body: "Showroom Quận 1 mở cửa đến mấy giờ vậy shop?", sentAt: "2026-08-18T11:20:00+07:00" }],
  },
];

const collection = createMockCollection<Conversation>(seed, { entityName: "Conversation", keywordFields: ["customerName", "customerEmail"] });

export const supportChatService = {
  list: (request?: CriteriaRequest) => collection.list(request),
  listAll: () => collection.listAll(),
  get: (id: string) => collection.get(id),

  assign: (id: string, agentId: string, agentName: string) => collection.update(id, { status: "assigned", assignedAgentId: agentId, assignedAgentName: agentName }),

  close: (id: string) => collection.update(id, { status: "closed" }),

  async appendMessage(id: string, message: { sender: "agent"; senderName: string; body: string }) {
    const conversation = await collection.get(id);
    const newMessage = { id: `m-${crypto.randomUUID()}`, sentAt: new Date().toISOString(), ...message };
    return collection.update(id, { messages: [...conversation.messages, newMessage] });
  },
};
