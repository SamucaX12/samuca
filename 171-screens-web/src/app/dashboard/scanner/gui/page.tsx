import { getSession } from "@/lib/auth";
import { canAccessGui } from "@/lib/scanner-access";
import { redirect } from "next/navigation";
import GuiClient from "./GuiClient";

export default async function ScannerGuiPage() {
  const session = await getSession();
  if (!canAccessGui(session!.scannerPlan, session!.role)) {
    redirect("/dashboard/scanner/pins");
  }
  return <GuiClient />;
}
