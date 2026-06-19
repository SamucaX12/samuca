import { createSession, getSession } from "@/lib/auth";
import { fetchMemberRolesBot } from "@/lib/discord-roles";
import { getDb } from "@/lib/mongodb";
import { applyTierToUser } from "@/lib/sync-tier";
import { DISCORD_ROLE_LABELS } from "@/lib/discord-roles";
import { tierLabel } from "@/lib/tier-access";
import type { UserDoc } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const roleIds = await fetchMemberRolesBot(session.id);
  if (!roleIds) {
    return NextResponse.json(
      { error: "sync_failed", message: "Não foi possível ler teus cargos. Entra no servidor 171 ScreenS." },
      { status: 502 }
    );
  }

  const { tier, changed } = await applyTierToUser(session.id, roleIds, "bot");

  const db = await getDb();
  const userDoc = await db.collection<UserDoc>("users").findOne({ discordId: session.id });
  if (!userDoc) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  await createSession(userDoc);

  return NextResponse.json({
    ok: true,
    changed,
    tier,
    label: tier ? DISCORD_ROLE_LABELS[tier] : null,
    display: tier ? tierLabel(tier) : "Sem acesso",
    message: tier
      ? changed
        ? `Cargo sincronizado: ${DISCORD_ROLE_LABELS[tier]}`
        : `Já estás com ${DISCORD_ROLE_LABELS[tier]}`
      : "Nenhum cargo de curso encontrado. Compra no Discord primeiro.",
  });
}
