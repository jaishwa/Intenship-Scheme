"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { NAV_LINKS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const { openSearch, openDrawer, toggleMobileNav } = useUIStore();
  const { totalItems: cartCount, openCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-sticky w-full transition-all duration-300",
        isScrolled
          ? "glass border-b border-white/5"
          : "bg-transparent border-b border-transparent"
      )}
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className="container-obsidian">
        <div className="flex h-16 items-center justify-between lg:h-20">
          
          {/* Mobile Menu & Search (Left) */}
          <div className="flex flex-1 items-center gap-4 lg:hidden">
            <button
              onClick={toggleMobileNav}
              className="text-foreground hover:text-gold-champagne transition-colors p-2 -ml-2"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={openSearch}
              className="text-foreground hover:text-gold-champagne transition-colors p-2"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop Nav (Left) */}
          <nav className="hidden flex-1 items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative h-full py-6"
                onMouseEnter={() => link.children ? setActiveMegaMenu(link.label) : setActiveMegaMenu(null)}
              >
                <Link
                  href={link.href}
                  className="font-sans text-sm font-medium uppercase tracking-widest hover:text-gold-champagne transition-colors flex items-center gap-2"
                >
                  {link.label}
                  {link.badge && (
                    <span className="bg-gold-champagne text-obsidian text-[10px] px-1.5 py-0.5 font-bold rounded-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Logo (Center) */}
          <Link href="/" className="flex flex-1 justify-center lg:flex-none">
            <h1 className="font-display text-2xl font-normal tracking-tight lg:text-3xl text-gradient-bone hover:text-gold-champagne transition-all duration-300">
              OBSIDIAN
            </h1>
          </Link>

          {/* Actions (Right) */}
          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-5">
            <button
              onClick={openSearch}
              className="hidden text-foreground hover:text-gold-champagne transition-colors p-2 lg:block"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => openDrawer("wishlist")}
              className="relative text-foreground hover:text-gold-champagne transition-colors p-2"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold-champagne text-[9px] font-bold text-obsidian">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              className="hidden text-foreground hover:text-gold-champagne transition-colors p-2 lg:block"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>

            <button
              onClick={openCart}
              className="relative text-foreground hover:text-gold-champagne transition-colors p-2"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold-champagne text-[9px] font-bold text-obsidian">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Overlay */}
      {activeMegaMenu && (
        <div 
          className="absolute left-0 top-full w-full bg-card border-b border-border shadow-xl origin-top animate-in slide-in-from-top-2 duration-200"
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <div className="container-obsidian py-8">
            <div className="grid grid-cols-4 gap-8">
              <div className="col-span-1">
                <h3 className="eyebrow mb-6">Categories</h3>
                <ul className="space-y-4">
                  {NAV_LINKS.find(l => l.label === activeMegaMenu)?.children?.slice(0, 5).map(child => (
                    <li key={child.label}>
                      <Link href={child.href} className="font-sans text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-all">
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-1">
                <h3 className="eyebrow mb-6 invisible">More</h3>
                <ul className="space-y-4">
                  {NAV_LINKS.find(l => l.label === activeMegaMenu)?.children?.slice(5, 10).map(child => (
                    <li key={child.label}>
                      <Link href={child.href} className="font-sans text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-all">
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                 {NAV_LINKS.find(l => l.label === activeMegaMenu)?.children?.slice(0, 2).map((child, idx) => (
                    <Link key={idx} href={child.href} className="group block relative aspect-[4/3] overflow-hidden bg-muted">
                        <Image
                          src={child.image || ""}
                          alt={child.label}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                        <div className="absolute bottom-4 left-4">
                          <p className="font-display text-lg text-white">{child.label}</p>
                        </div>
                    </Link>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
