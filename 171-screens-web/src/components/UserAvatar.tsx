"use client";

import { useMemo, useState } from "react";

export function getDiscordAvatarUrl(userId: string, avatar: string | null | undefined, size = 64) {
  if (!userId || !/^\d+$/.test(userId)) {
    return null;
  }
  if (!avatar) {
    try {
      const index = Number((BigInt(userId) >> BigInt(22)) % BigInt(6));
      return `https://cdn.discordapp.com/embed/avatars/${index}.png?size=${size}`;
    } catch {
      return `https://cdn.discordapp.com/embed/avatars/0.png?size=${size}`;
    }
  }
  const ext = avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${ext}?size=${size}&quality=lossless`;
}

function initialsFromName(name: string) {
  const parts = name.split(/[\s·|]+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function UserAvatar({
  userId,
  avatar,
  name,
  size = 40,
  className = "",
}: {
  userId: string;
  avatar: string | null | undefined;
  name: string;
  size?: number;
  className?: string;
}) {
  const directUrl = avatar?.startsWith("http") ? avatar : null;
  const primary = directUrl ?? getDiscordAvatarUrl(userId, avatar, size * 2);
  const fallback = getDiscordAvatarUrl(userId, null, size * 2);
  const [failed, setFailed] = useState(false);
  const [src, setSrc] = useState(primary ?? fallback);
  const initials = useMemo(() => initialsFromName(name), [name]);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-screens-border bg-gradient-to-br from-screens-accent/25 to-violet-500/20 font-bold text-screens-accent ${className}`}
        style={{ width: size, height: size, minWidth: size, fontSize: Math.max(10, size * 0.34) }}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={`rounded-lg border border-screens-border bg-screens-bg object-cover ${className}`}
      style={{ width: size, height: size, minWidth: size }}
      onError={() => {
        if (fallback && src !== fallback) {
          setSrc(fallback);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
