import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { QuickViewModal } from "@/components/storefront/quick-view-modal";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      
      {/* Search Overlay & Mobile Nav */}
      <SearchOverlay />
      <MobileNav />
      
      <main className="flex-1">{children}</main>
      
      <Footer />
      
      {/* Global Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
    </div>
  );
}
