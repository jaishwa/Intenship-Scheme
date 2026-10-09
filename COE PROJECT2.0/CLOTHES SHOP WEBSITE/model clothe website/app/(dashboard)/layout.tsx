import type { ReactNode } from "react";

/**
 * Dashboard layout — wraps all customer account pages.
 * Will eventually contain: DashboardSidebar, DashboardHeader, breadcrumbs, etc.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* TODO Phase 4: <DashboardSidebar /> */}
      <div className="flex flex-1 flex-col">
        {/* TODO Phase 4: <DashboardHeader /> */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
