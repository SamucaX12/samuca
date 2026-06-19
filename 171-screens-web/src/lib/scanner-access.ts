import type { UserRole } from "./types";
import type { ScannerPlan } from "./scanner-types";

export function hasScannerAccess(plan: ScannerPlan, role: UserRole) {
  return role === "owner" || role === "admin" || plan !== null;
}

export function hasProAccess(plan: ScannerPlan, role: UserRole) {
  return (
    role === "owner" ||
    role === "admin" ||
    plan === "pro" ||
    plan === "private" ||
    plan === "enterprise" ||
    plan === "team"
  );
}

export function canAccessStrings(plan: ScannerPlan, role: UserRole) {
  return role === "owner" || role === "admin" || plan === "private";
}

export function canAccessGui(plan: ScannerPlan, role: UserRole) {
  return role === "owner" || role === "admin" || plan === "private";
}

export function canAccessCustomDetect(plan: ScannerPlan, role: UserRole) {
  return role === "owner" || role === "admin" || plan === "private";
}

export function hasEnterpriseAccess(plan: ScannerPlan, role: UserRole) {
  return role === "owner" || role === "admin" || plan === "enterprise" || plan === "team";
}

export function hasPrivateAccess(plan: ScannerPlan, role: UserRole) {
  return role === "owner" || role === "admin" || plan === "private";
}

export function scannerPlanLabel(plan: ScannerPlan) {
  if (!plan) return "Sem plano";
  if (plan === "pro") return "Scanner Pro";
  if (plan === "private") return "Scanner Privado";
  if (plan === "team") return "Enterprise Duo";
  return "Enterprise";
}

export function scannerPlanFeatures(plan: ScannerPlan) {
  return {
    pins: hasProAccess(plan, "customer"),
    results: hasProAccess(plan, "customer"),
    strings: canAccessStrings(plan, "customer"),
    gui: canAccessGui(plan, "customer"),
    customDetect: canAccessCustomDetect(plan, "customer"),
    enterprise: hasEnterpriseAccess(plan, "customer"),
  };
}
