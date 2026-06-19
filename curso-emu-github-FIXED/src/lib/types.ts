export type CourseTier = "tier1" | "tier2" | "tier3";
export type UserRole = "customer" | "admin" | "owner";

export type UserDoc = {
  _id?: import("mongodb").ObjectId;
  discordId: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
  email: string | null;
  role: UserRole;
  courseTier: CourseTier | null;
  banned: boolean;
  lastIp?: string;
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
  banned: boolean;
};
