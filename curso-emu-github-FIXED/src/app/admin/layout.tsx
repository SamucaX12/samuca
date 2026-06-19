import { redirect } from "next/navigation";
import { getSession, isAdmin, isOwner } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdmin(session.role)) redirect("/dashboard");

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
