"use client";

import { useLayoutEffect, useState } from "react";

interface SafeLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SafeLink({ href, children, className }: SafeLinkProps) {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={className}
    >
      {children}
    </a>
  );
}
