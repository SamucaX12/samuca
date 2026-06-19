import type { ScannerPlan } from "./scanner-types";

export type CourseTier = "tier1" | "tier2" | "tier3";
export type UserRole = "customer" | "admin" | "owner";

export type CourseAccessSource = "booster" | "paid" | null;

export type UserDoc = {
  _id?: string;
  discordId: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
  email: string | null;
  role: UserRole;
  courseTier: CourseTier | null;
  accessSource?: CourseAccessSource;
  banned: boolean;
  lastIp?: string;
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionUser = {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
  email: string | null;
  role: UserRole;
  courseTier: CourseTier | null;
  accessSource?: CourseAccessSource;
  scannerPlan: ScannerPlan;
  enterpriseId?: string | null;
  banned: boolean;
};
