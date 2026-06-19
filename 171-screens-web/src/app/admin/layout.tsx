import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { DashboardShell } from "@/components/DashboardShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdmin(session.role)) redirect("/dashboard");

  const db = await getDb();
  await db.collection("users").updateOne(
    { discordId: session.id },
    { $set: { lastSeenAt: new Date() } }
  );

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
