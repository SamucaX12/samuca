import { NextRequest, NextResponse } from "next/server";
import { getSession, isOwner } from "@/lib/auth";
import { hasEnterpriseAccess, hasProAccess, canAccessStrings, canAccessGui, canAccessCustomDetect } from "@/lib/scanner-access";
import {
  getEnterpriseByOwnerId,
  getEnterpriseForUser,
  setupEnterprise,
  saveEnterpriseConfig,
  saveGlobalConfig,
  getGlobalConfig,
  getProConfig,
  saveProConfig,
  logScannerAudit,
  addEnterpriseMemberByEmail,
  removeEnterpriseMember,
  updateEnterpriseName,
} from "@/lib/scanner-helpers";
import { CustomPattern } from "@/lib/scanner-types";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const area = req.nextUrl.searchParams.get("area") ?? "enterprise";

  if (area === "enterprise") {
    if (!hasEnterpriseAccess(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const ent = await getEnterpriseForUser(session.id);
    const isOwner = ent ? ent.ownerId === session.id : true;
    return NextResponse.json({
      enterprise: ent,
      needsSetup: !ent,
      isOwner,
      plan: session.scannerPlan,
    });
  }

  if (area === "scanner") {
    if (!canAccessStrings(session.scannerPlan, session.role) && !canAccessGui(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const global = await getGlobalConfig();
    const pro = await getProConfig(session.id);
    return NextResponse.json({
      publicStrings: global.publicStrings ?? [],
      publicCustomDetect: global.publicCustomDetect ?? [],
      strings: pro.strings ?? [],
      customDetect: pro.customDetect ?? [],
      gui: {
        scannerName: pro.scannerName ?? global.scannerName,
        primaryColor: pro.primaryColor ?? global.primaryColor,
        spinnerColor1: pro.spinnerColor1 ?? global.spinnerColor1,
        spinnerColor2: pro.spinnerColor2 ?? global.spinnerColor2,
        spinnerColor3: pro.spinnerColor3 ?? global.spinnerColor3,
        logoUrl: pro.logoUrl ?? global.logoUrl ?? "",
        loadingPhrases: pro.loadingPhrases ?? global.loadingPhrases ?? [],
      },
    });
  }

  if (area === "public" && isOwner(session.role)) {
    const global = await getGlobalConfig();
    return NextResponse.json({
      publicStrings: global.publicStrings ?? [],
      publicCustomDetect: global.publicCustomDetect ?? [],
    });
  }

  return NextResponse.json({ error: "invalid area" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const area = body.area as string;

  if (area === "setup_enterprise") {
    if (!hasEnterpriseAccess(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const name = body.name as string;
    const plan = session.scannerPlan === "team" ? "team" : "enterprise";
    const result = await setupEnterprise(session.id, name, plan);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    await logScannerAudit("enterprise_setup", session.id, session.globalName || session.username, {
      details: result.enterprise.name,
    });
    return NextResponse.json({ ok: true, enterprise: result.enterprise });
  }

  if (area === "rename_enterprise") {
    if (!hasEnterpriseAccess(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const name = body.name as string;
    const result = await updateEnterpriseName(session.id, name);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    await logScannerAudit("enterprise_rename", session.id, session.globalName || session.username, { details: name });
    return NextResponse.json({ ok: true });
  }

  if (area === "enterprise") {
    if (!hasEnterpriseAccess(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const ent = await getEnterpriseByOwnerId(session.id);
    if (!ent) return NextResponse.json({ error: "enterprise_not_setup" }, { status: 400 });

    const config = {
      scannerName: body.scannerName,
      primaryColor: body.primaryColor,
      spinnerColor1: body.spinnerColor1,
      spinnerColor2: body.spinnerColor2,
      spinnerColor3: body.spinnerColor3,
      logoUrl: body.logoUrl,
      loadingPhrases: body.loadingPhrases as string[] | undefined,
      customPatterns: body.customPatterns as CustomPattern[] | undefined,
    };

    await saveEnterpriseConfig(session.id, config);
    await logScannerAudit("enterprise_config_update", session.id, session.globalName || session.username);
    return NextResponse.json({ ok: true });
  }

  if (area === "add_member") {
    if (!hasEnterpriseAccess(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const email = body.email as string;
    if (!email?.trim()) return NextResponse.json({ error: "email_required" }, { status: 400 });
    const result = await addEnterpriseMemberByEmail(session.id, email);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    await logScannerAudit("enterprise_add_member", session.id, session.globalName || session.username, {
      targetId: result.member?.discordId,
      details: email,
    });
    return NextResponse.json({ ok: true, member: result.member });
  }

  if (area === "remove_member") {
    if (!hasEnterpriseAccess(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const memberId = body.memberId as string;
    if (!memberId) return NextResponse.json({ error: "member_required" }, { status: 400 });
    const result = await removeEnterpriseMember(session.id, memberId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    await logScannerAudit("enterprise_remove_member", session.id, session.globalName || session.username, {
      targetId: memberId,
    });
    return NextResponse.json({ ok: true });
  }

  if (area === "scanner") {
    if (!canAccessStrings(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const payload: Record<string, unknown> = {};
    if (canAccessStrings(session.scannerPlan, session.role)) {
      payload.strings = body.strings as CustomPattern[];
    }
    if (canAccessCustomDetect(session.scannerPlan, session.role)) {
      payload.customDetect = body.customDetect as CustomPattern[];
    }

    await saveProConfig(session.id, payload);
    await logScannerAudit("scanner_strings_update", session.id, session.globalName || session.username);
    return NextResponse.json({ ok: true });
  }

  if (area === "gui") {
    if (!canAccessGui(session.scannerPlan, session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    await saveProConfig(session.id, {
      scannerName: body.scannerName,
      primaryColor: body.primaryColor,
      spinnerColor1: body.spinnerColor1,
      spinnerColor2: body.spinnerColor2,
      spinnerColor3: body.spinnerColor3,
      logoUrl: body.logoUrl,
      loadingPhrases: body.loadingPhrases as string[] | undefined,
    });
    await logScannerAudit("scanner_gui_update", session.id, session.globalName || session.username);
    return NextResponse.json({ ok: true });
  }

  if (area === "public" && isOwner(session.role)) {
    await saveGlobalConfig({
      publicStrings: body.publicStrings as CustomPattern[],
      publicCustomDetect: body.publicCustomDetect as CustomPattern[],
    });
    await logScannerAudit("public_patterns_update", session.id, session.globalName || session.username);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "invalid area" }, { status: 400 });
}
