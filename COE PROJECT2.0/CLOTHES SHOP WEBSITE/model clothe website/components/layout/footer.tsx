import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-obsidian text-muted-foreground pt-16 pb-8">
      <div className="container-obsidian">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <h2 className="font-display text-2xl text-gradient-bone">OBSIDIAN</h2>
            </Link>
            <p className="font-sans text-sm leading-relaxed mb-6">
              Premium fashion brand crafting timeless pieces for the discerning individual. 
              Elevating everyday essentials with luxury construction.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold-champagne transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-gold-champagne transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-gold-champagne transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-gold-champagne transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-sans font-medium text-foreground mb-6 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/collections/new" className="hover:text-gold-champagne transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/bestsellers" className="hover:text-gold-champagne transition-colors">Bestsellers</Link></li>
              <li><Link href="/collections/men" className="hover:text-gold-champagne transition-colors">Men</Link></li>
              <li><Link href="/collections/women" className="hover:text-gold-champagne transition-colors">Women</Link></li>
              <li><Link href="/collections/accessories" className="hover:text-gold-champagne transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-medium text-foreground mb-6 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/help" className="hover:text-gold-champagne transition-colors">Help Center</Link></li>
              <li><Link href="/track-order" className="hover:text-gold-champagne transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-gold-champagne transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="hover:text-gold-champagne transition-colors">Shipping Info</Link></li>
              <li><Link href="/contact" className="hover:text-gold-champagne transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-medium text-foreground mb-6 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/terms" className="hover:text-gold-champagne transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-gold-champagne transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-gold-champagne transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs font-sans">
          <p>&copy; {new Date().getFullYear()} OBSIDIAN. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             {/* Simple payment icons text for now */}
             <span className="uppercase tracking-widest text-[10px]">Visa</span>
             <span className="uppercase tracking-widest text-[10px]">Mastercard</span>
             <span className="uppercase tracking-widest text-[10px]">Amex</span>
             <span className="uppercase tracking-widest text-[10px]">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
