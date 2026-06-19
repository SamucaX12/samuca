import { redirect } from "next/navigation";
import { getSession, isOwner } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";

export default async function ComprarLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
