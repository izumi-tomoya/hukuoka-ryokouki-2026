'use client';

import { User as UserIcon } from 'lucide-react';
import Image from 'next/image';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
}

export function UserAvatar({ src, name }: UserAvatarProps) {
  if (!src) {
    return (
      <div className="w-28 h-28 rounded-full bg-stone-100 flex items-center justify-center border border-zinc-100 overflow-hidden shadow-inner">
        <UserIcon size={40} className="text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="w-28 h-28 rounded-full bg-stone-100 border border-zinc-100 overflow-hidden shadow-sm relative ring-4 ring-white">
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
