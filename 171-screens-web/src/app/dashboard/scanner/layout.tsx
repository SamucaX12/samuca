import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasScannerAccess } from "@/lib/scanner-access";
import { RedeemKeyPanel } from "@/components/scanner/RedeemKeyPanel";

export default async function ScannerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasScannerAccess(session.scannerPlan, session.role)) {
    return <RedeemKeyPanel />;
  }
  return <>{children}</>;
}
