import type { ScannerPlan } from "./scanner-types";

export const KEY_PLAN_LABELS: Record<Exclude<ScannerPlan, null>, string> = {
  pro: "Pro — Pins + Results",
  private: "Privado — GUI + Strings + Custom Detect",
  enterprise: "Enterprise — Equipe (5) + ImGui + Strings",
  team: "Duo Enterprise — Equipe (2) + ImGui + Strings",
};
