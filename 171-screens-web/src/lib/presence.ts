const ONLINE_MS = 5 * 60 * 1000;

export function isUserOnline(lastSeenAt?: string | Date | null): boolean {
  if (!lastSeenAt) return false;
  const ts = lastSeenAt instanceof Date ? lastSeenAt.getTime() : new Date(lastSeenAt).getTime();
  return Date.now() - ts < ONLINE_MS;
}

export function formatLastSeen(lastSeenAt?: string | Date | null): string {
  if (!lastSeenAt) return "Nunca";
  const ts = lastSeenAt instanceof Date ? lastSeenAt.getTime() : new Date(lastSeenAt).getTime();
  const diff = Date.now() - ts;
  if (diff < 60_000) return "Agora";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}min atrás`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h atrás`;
  return `${Math.floor(diff / 86400_000)}d atrás`;
}
