"use client";

import { usePathname } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar on the home/dashboard page
  const showSidebar = pathname !== "/";

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />

      {/* Main content area */}
      <main className="flex-1 h-screen overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
