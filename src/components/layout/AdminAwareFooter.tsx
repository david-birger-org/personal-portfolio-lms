"use client";

import { usePathname } from "next/navigation";

export function AdminAwareFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isAdminPage = segments[0] === "admin" || segments[1] === "admin";

  if (isAdminPage) {
    return null;
  }

  return <>{children}</>;
}
