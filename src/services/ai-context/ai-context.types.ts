export type AiContextCategory =
  | "brand"
  | "company"
  | "products"
  | "writingStyle"
  | "customerSupport"
  | "seoRules"
  | "businessRules"
  | "workflowRules"
  | "legal"
  | "general";

/**
 * A reusable block of tenant business/context knowledge to be supplied to the future AI Service —
 * not model training. `scope: "global"` applies to every account; `scope: "group"` applies only to
 * accounts assigned to it (assignment itself isn't modeled yet — no account/team directory exists
 * to assign against beyond the mock `assignedCount`, kept as a display stat).
 */
export interface AiContextGroup {
  id: string;
  name: string;
  category: AiContextCategory;
  scope: "global" | "group";
  content: string;
  assignedCount: number;
  updatedAt: string;
}

/** One personal-context record per signed-in account, layered on top of any Global/Group context that applies to them. */
export interface PersonalAiContext {
  content: string;
  updatedAt: string;
}
