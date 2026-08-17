"use client";

import type { CriteriaFilter } from "@novacore/frontend-foundation";
import { Select, type SelectOption } from "@novacore/frontend-next-shadcn";

const ALL_VALUE = "all";

const POSITION_OPTIONS: SelectOption[] = [
  { value: ALL_VALUE, label: "Mọi vị trí" },
  { value: "pos-giam-doc", label: "Giám đốc điều hành" },
  { value: "pos-truong-phong-noi-dung", label: "Trưởng phòng Nội dung" },
  { value: "pos-truong-phong-kinh-doanh", label: "Trưởng phòng Kinh doanh" },
  { value: "pos-bien-tap-vien", label: "Biên tập viên" },
  { value: "pos-nhan-vien-ban-hang", label: "Nhân viên bán hàng" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: ALL_VALUE, label: "Mọi trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

function getFilterValue(filters: CriteriaFilter[], field: string): string {
  const match = filters.find((filter) => filter.field === field);
  return typeof match?.value === "string" ? match.value : ALL_VALUE;
}

function setFilterValue(filters: CriteriaFilter[], field: string, value: string): CriteriaFilter[] {
  const rest = filters.filter((filter) => filter.field !== field);
  return value === ALL_VALUE ? rest : [...rest, { field, operator: "eq", value }];
}

export interface UserPermissionsFiltersProps {
  filters: CriteriaFilter[];
  onFiltersChange: (filters: CriteriaFilter[]) => void;
}

/**
 * WCM's `renderFilters` slot for the shared `UserPermissionAssignment` page — Position and
 * Status, the two dimensions WCM's mock member directory actually supports. Translates each
 * `<Select>` into the real `CriteriaFilter[]` shape `SubjectSearchProvider.search()` receives —
 * the shared component owns and threads this state, this file only supplies the controls.
 */
export function UserPermissionsFilters({ filters, onFiltersChange }: UserPermissionsFiltersProps) {
  return (
    <>
      <Select
        options={POSITION_OPTIONS}
        value={getFilterValue(filters, "positionId")}
        onValueChange={(value) => onFiltersChange(setFilterValue(filters, "positionId", value))}
        className="w-48"
      />
      <Select
        options={STATUS_OPTIONS}
        value={getFilterValue(filters, "status")}
        onValueChange={(value) => onFiltersChange(setFilterValue(filters, "status", value))}
        className="w-40"
      />
    </>
  );
}
