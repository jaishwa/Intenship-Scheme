'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Heart, ArrowRight, Home, Tag, Star, Layers } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { NAV_ITEMS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

const overlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawer = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' },
};

const cartDrawer = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit: { x: '100%' },
};

export function MobileMenuDrawer() {
  const { activeDrawer, closeDrawer } = useUIStore();
  const isOpen = activeDrawer === 'menu';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlay} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[80] bg-obsidian/70 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.aside
            variants={drawer} initial="hidden" animate="visible" exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-[85] flex w-80 max-w-[85vw] flex-col bg-obsidian border-r border-champagne/10 shadow-card"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between border-b border-champagne/10 px-6 py-5">
              <span className="font-serif text-xl tracking-[0.15em] text-bone">OBSIDIAN</span>
              <button onClick={closeDrawer} className="btn-ghost p-1.5" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      onClick={closeDrawer}
                      className="flex items-center justify-between rounded-lg px-3 py-3 font-sans text-sm font-medium text-bone/80 transition-colors hover:bg-charcoal hover:text-bone"
                    >
                      {item.label}
                      {item.children.length > 0 && <ArrowRight size={14} className="text-champagne" />}
                    </Link>
                    {item.children.length > 0 && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={closeDrawer}
                            className="block rounded px-3 py-2 text-xs text-bone/50 hover:text-champagne transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            <div className="border-t border-champagne/10 px-4 py-4 space-y-2">
              <Link href="/account" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 text-sm text-bone/60 hover:text-bone transition-colors">
                <Home size={16} /> My Account
              </Link>
              <Link href="/orders" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 text-sm text-bone/60 hover:text-bone transition-colors">
                <Tag size={16} /> My Orders
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function CartDrawer() {
  const { activeDrawer, closeDrawer } = useUIStore();
  const { items, itemCount, summary, removeItem, updateQuantity } = useCartStore();
  const isOpen = activeDrawer === 'cart';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlay} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[80] bg-obsidian/70 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.aside
            variants={cartDrawer} initial="hidden" animate="visible" exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-[85] flex w-96 max-w-[92vw] flex-col bg-obsidian border-l border-champagne/10 shadow-card"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-champagne/10 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-champagne" />
                <span className="font-sans text-sm font-semibold uppercase tracking-widest text-bone">
                  Cart ({itemCount})
                </span>
              </div>
              <button onClick={closeDrawer} className="btn-ghost p-1.5" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Free shipping progress */}
            {summary.freeShippingRemaining > 0 && (
              <div className="border-b border-champagne/10 px-6 py-3">
                <p className="mb-2 text-xs text-bone/60">
                  Add <span className="text-champagne font-semibold">{formatPrice(summary.freeShippingRemaining)}</span> more for free shipping
                </p>
                <div className="h-1 w-full overflow-hidden rounded-full bg-charcoal">
                  <div
                    className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((summary.freeShippingThreshold - summary.freeShippingRemaining) / summary.freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-bone/20" />
                  <p className="text-bone/40 text-sm">Your cart is empty</p>
                  <button onClick={closeDrawer} className="btn-secondary text-xs px-6 py-2.5">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex gap-4 rounded-lg bg-charcoal/50 p-3">
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-charcoal">
                        <Image
                          src={item.product.images[0].src}
                          alt={item.product.images[0].alt}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <p className="truncate text-sm font-medium text-bone">{item.product.name}</p>
                          <p className="text-xs text-bone/50 mt-0.5">{item.size} · {item.color}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-champagne/20 text-bone/60 hover:border-champagne hover:text-bone transition-colors text-sm"
                              aria-label="Decrease quantity"
                            >−</button>
                            <span className="text-sm font-medium text-bone w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-champagne/20 text-bone/60 hover:border-champagne hover:text-bone transition-colors text-sm"
                              aria-label="Increase quantity"
                            >+</button>
                          </div>
                          <p className="text-sm font-semibold text-champagne">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="self-start p-1 text-bone/30 hover:text-bone transition-colors"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer summary */}
            {items.length > 0 && (
              <div className="border-t border-champagne/10 px-6 py-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-bone/60">
                    <span>Subtotal</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  {summary.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount</span>
                      <span>−{formatPrice(summary.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-bone/60">
                    <span>Shipping</span>
                    <span>{summary.shippingCost === 0 ? 'FREE' : formatPrice(summary.shippingCost)}</span>
                  </div>
                  <div className="divider-gold my-2" />
                  <div className="flex justify-between font-semibold text-bone">
                    <span>Total</span>
                    <span className="text-champagne">{formatPrice(summary.total)}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={closeDrawer} className="btn-primary w-full">
                  Checkout
                  <ArrowRight size={16} />
                </Link>
                <button onClick={closeDrawer} className="w-full text-center text-xs text-bone/40 hover:text-bone/60 transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function WishlistDrawer() {
  const { activeDrawer, closeDrawer, openQuickView } = useUIStore();
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const isOpen = activeDrawer === 'wishlist';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlay} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[80] bg-obsidian/70 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.aside
            variants={cartDrawer} initial="hidden" animate="visible" exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-[85] flex w-96 max-w-[92vw] flex-col bg-obsidian border-l border-champagne/10 shadow-card"
            aria-label="Wishlist"
          >
            <div className="flex items-center justify-between border-b border-champagne/10 px-6 py-5">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-champagne" />
                <span className="font-sans text-sm font-semibold uppercase tracking-widest text-bone">
                  Wishlist ({items.length})
                </span>
              </div>
              <button onClick={closeDrawer} className="btn-ghost p-1.5" aria-label="Close wishlist">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <Heart size={48} className="text-bone/20" />
                  <p className="text-bone/40 text-sm">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((product) => (
                    <div key={product.id} className="flex gap-4 rounded-lg bg-charcoal/50 p-3">
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-charcoal">
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt}
                          fill className="object-cover" sizes="64px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <p className="truncate text-sm font-medium text-bone">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-champagne">{formatPrice(product.price)}</span>
                          <span className="text-xs text-bone/40 line-through">{formatPrice(product.mrp)}</span>
                        </div>
                        <button
                          onClick={() => {
                            addToCart(product, product.sizes[0], product.colors[0].name);
                            removeItem(product.id);
                          }}
                          className="mt-1 text-xs text-champagne hover:text-champagne-light transition-colors text-left"
                        >
                          Move to Cart →
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="self-start p-1 text-bone/30 hover:text-bone transition-colors"
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
