import { createMockCollection } from "@/shared/lib/mock/mockCollection";

export interface MockSubject {
  id: string;
  name: string;
  email: string;
  positionId: string | null;
  status: "active" | "inactive";
}

const SEED: MockSubject[] = [
  { id: "subj-001", name: "Nguyễn Văn An", email: "an.nguyen@nova-wcm.example", positionId: "pos-giam-doc", status: "active" },
  { id: "subj-002", name: "Trần Thị Bích", email: "bich.tran@nova-wcm.example", positionId: "pos-truong-phong-noi-dung", status: "active" },
  { id: "subj-003", name: "Lê Minh Châu", email: "chau.le@nova-wcm.example", positionId: "pos-truong-phong-kinh-doanh", status: "active" },
  { id: "subj-004", name: "Phạm Thị Dung", email: "dung.pham@nova-wcm.example", positionId: "pos-bien-tap-vien", status: "active" },
  { id: "subj-005", name: "Hoàng Văn Đức", email: "duc.hoang@nova-wcm.example", positionId: "pos-bien-tap-vien", status: "active" },
  { id: "subj-006", name: "Vũ Thị Giang", email: "giang.vu@nova-wcm.example", positionId: "pos-bien-tap-vien", status: "inactive" },
  { id: "subj-007", name: "Đặng Văn Hải", email: "hai.dang@nova-wcm.example", positionId: "pos-nhan-vien-ban-hang", status: "active" },
  { id: "subj-008", name: "Bùi Thị Hoa", email: "hoa.bui@nova-wcm.example", positionId: "pos-nhan-vien-ban-hang", status: "active" },
  { id: "subj-009", name: "Ngô Văn Khang", email: "khang.ngo@nova-wcm.example", positionId: "pos-nhan-vien-ban-hang", status: "active" },
  { id: "subj-010", name: "Đỗ Thị Lan", email: "lan.do@nova-wcm.example", positionId: "pos-nhan-vien-ban-hang", status: "inactive" },
  { id: "subj-011", name: "Phan Văn Minh", email: "minh.phan@nova-wcm.example", positionId: "pos-truong-phong-noi-dung", status: "active" },
  { id: "subj-012", name: "Vương Thị Ngọc", email: "ngoc.vuong@nova-wcm.example", positionId: "pos-bien-tap-vien", status: "active" },
  { id: "subj-013", name: "Lý Văn Phong", email: "phong.ly@nova-wcm.example", positionId: "pos-truong-phong-kinh-doanh", status: "active" },
  { id: "subj-014", name: "Trương Thị Quỳnh", email: "quynh.truong@nova-wcm.example", positionId: "pos-nhan-vien-ban-hang", status: "active" },
  { id: "subj-015", name: "Đinh Văn Sơn", email: "son.dinh@nova-wcm.example", positionId: null, status: "inactive" },
];

export const subjectCollection = createMockCollection(SEED, {
  entityName: "Subject",
  keywordFields: ["name", "email"],
});
