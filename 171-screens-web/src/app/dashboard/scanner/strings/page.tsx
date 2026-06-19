import { getSession } from "@/lib/auth";
import { canAccessCustomDetect, canAccessStrings } from "@/lib/scanner-access";
import { redirect } from "next/navigation";
import StringsClient from "./StringsClient";

export default async function ScannerStringsPage() {
  const session = await getSession();
  if (!canAccessStrings(session!.scannerPlan, session!.role)) {
    redirect("/dashboard/scanner/pins");
  }
  return <StringsClient canCustomDetect={canAccessCustomDetect(session!.scannerPlan, session!.role)} />;
}
