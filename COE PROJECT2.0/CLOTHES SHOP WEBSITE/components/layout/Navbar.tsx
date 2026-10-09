'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, ArrowRight
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useUIStore } from '@/store/ui-store';
import { NAV_ITEMS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const { itemCount: cartCount } = useCartStore();
  const { itemCount: wishlistCount } = useWishlistStore();
  const { openSearch, openDrawer, searchOpen, closeSearch, searchQuery, setSearchQuery } = useUIStore();

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[90] w-full transition-all duration-500',
          scrolled
            ? 'bg-obsidian/95 shadow-card backdrop-blur-xl border-b border-champagne/10'
            : 'bg-obsidian/80 backdrop-blur-md',
        )}
      >
        <nav
          ref={megaMenuRef}
          className="container-obsidian flex h-16 items-center justify-between gap-4"
          aria-label="Main navigation"
        >
          {/* Mobile: Hamburger */}
          <button
            className="lg:hidden btn-ghost p-2"
            onClick={() => openDrawer('menu')}
            aria-label="Open navigation menu"
            aria-expanded={false}
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 font-serif text-2xl font-light tracking-[0.2em] text-bone hover:text-champagne transition-colors"
            aria-label="OBSIDIAN Home"
          >
            OBSIDIAN
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {item.children.length > 0 ? (
                  <button
                    className={cn(
                      'nav-link flex items-center gap-1',
                      megaMenuOpen === item.label && 'text-bone after:w-full',
                    )}
                    onClick={() =>
                      setMegaMenuOpen(megaMenuOpen === item.label ? null : item.label)
                    }
                    aria-expanded={megaMenuOpen === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-200',
                        megaMenuOpen === item.label && 'rotate-180',
                      )}
                    />
                  </button>
                ) : (
                  <Link href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              className="btn-ghost p-2"
              onClick={openSearch}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <button
              className="btn-ghost relative p-2"
              onClick={() => openDrawer('wishlist')}
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-champagne text-[10px] font-bold text-obsidian"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </motion.span>
              )}
            </button>

            {/* Cart */}
            <button
              className="btn-ghost relative p-2"
              onClick={() => openDrawer('cart')}
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-champagne text-[10px] font-bold text-obsidian"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </button>

            {/* Profile */}
            <button className="btn-ghost p-2" aria-label="Account">
              <User size={20} />
            </button>
          </div>
        </nav>

        {/* Mega menu */}
        <AnimatePresence>
          {megaMenuOpen === 'Shop' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute left-0 right-0 top-full z-50 border-t border-champagne/10 bg-obsidian/98 backdrop-blur-xl shadow-card"
            >
              <div className="container-obsidian py-8">
                <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9">
                  {NAV_ITEMS.find((i) => i.label === 'Shop')?.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="group flex flex-col gap-3"
                      onClick={() => setMegaMenuOpen(null)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded bg-charcoal">
                        <Image
                          src={child.image ?? ''}
                          alt={child.label}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100px, 150px"
                        />
                        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-bone/70 transition-colors group-hover:text-champagne">
                        {child.label}
                        <ArrowRight size={10} className="opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex flex-col bg-obsidian/95 backdrop-blur-2xl"
          >
            <div className="container-obsidian flex h-20 items-center gap-4 border-b border-champagne/10">
              <Search size={20} className="text-champagne" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, styles, categories..."
                className="flex-1 bg-transparent font-sans text-lg text-bone placeholder:text-bone/30 focus:outline-none"
                aria-label="Search products"
              />
              <button
                onClick={closeSearch}
                className="btn-ghost p-2"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
            <div className="container-obsidian py-8">
              <p className="text-sm text-bone/40">
                {searchQuery
                  ? `Searching for "${searchQuery}"…`
                  : 'Start typing to search products'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
