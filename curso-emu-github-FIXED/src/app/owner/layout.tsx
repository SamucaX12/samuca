import { redirect } from "next/navigation";
import { getSession, isOwner } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isOwner(session.role)) redirect("/dashboard");

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
