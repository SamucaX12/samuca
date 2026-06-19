"use client";

import { useState } from "react";

export function getDiscordAvatarUrl(userId: string, avatar: string | null | undefined, size = 64) {
  if (!avatar) {
    const index = Number(BigInt(userId) >> BigInt(22) % BigInt(6));
    return `https://cdn.discordapp.com/embed/avatars/${index}.png?size=${size}`;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=${size}`;
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
  const primary = getDiscordAvatarUrl(userId, avatar, size * 2);
  const fallback = getDiscordAvatarUrl(userId, null, size * 2);
  const [src, setSrc] = useState(primary);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`rounded-lg border border-screens-border bg-screens-bg object-cover ${className}`}
      style={{ width: size, height: size, minWidth: size }}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
