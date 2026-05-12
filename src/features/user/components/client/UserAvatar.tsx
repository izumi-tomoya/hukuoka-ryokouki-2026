"use client";

import { User as UserIcon } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
}

export function UserAvatar({ src, name }: UserAvatarProps) {
  if (!src) {
    return (
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-zinc-100 bg-stone-100 shadow-inner">
        <UserIcon size={40} className="text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="relative h-28 w-28 overflow-hidden rounded-full border border-zinc-100 bg-stone-100 shadow-sm ring-4 ring-white">
      <Image
        src={src}
        alt={name || "User profile"}
        fill
        className="object-cover"
        unoptimized // Allow external URLs without strict domain whitelist
      />
    </div>
  );
}
