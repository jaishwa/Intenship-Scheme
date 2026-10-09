import type { ReactNode } from "react";

/**
 * Admin layout — wraps all admin panel pages.
 * Will eventually contain: AdminSidebar, AdminHeader, permission guards, etc.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-obsidian-950">
      {/* TODO Phase 5: <AdminSidebar /> */}
      <div className="flex flex-1 flex-col">
        {/* TODO Phase 5: <AdminHeader /> */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
