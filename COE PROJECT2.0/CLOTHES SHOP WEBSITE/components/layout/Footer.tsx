import Link from 'next/link';
import { Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About OBSIDIAN', href: '/about' },
    { label: 'Our Story', href: '/story' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Support: [
    { label: 'FAQs', href: '/faq' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Track Order', href: '/track' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Policies: [
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

const socials = [
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { label: 'Twitter / X', icon: Twitter, href: 'https://twitter.com' },
  { label: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  { label: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
];

const paymentMethods = ['Visa', 'Mastercard', 'UPI', 'Paytm', 'PhonePe', 'RazorPay', 'COD'];

export function Footer() {
  return (
    <footer className="border-t border-champagne/10 bg-obsidian" role="contentinfo">
      {/* Main footer */}
      <div className="container-obsidian py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/"
              className="font-serif text-3xl font-light tracking-[0.2em] text-bone hover:text-champagne transition-colors"
            >
              OBSIDIAN
            </Link>
            <p className="text-sm leading-relaxed text-bone/50 max-w-xs">
              Premium fashion crafted for the discerning individual. Where minimalism meets
              luxury — every piece tells a story.
            </p>
            {/* Contact */}
            <div className="space-y-2">
              <a href="mailto:support@obsidian-store.com"
                className="flex items-center gap-2 text-sm text-bone/50 hover:text-champagne transition-colors">
                <Mail size={14} /> support@obsidian-store.com
              </a>
              <a href="tel:+918000000000"
                className="flex items-center gap-2 text-sm text-bone/50 hover:text-champagne transition-colors">
                <Phone size={14} /> +91 80000 00000
              </a>
              <span className="flex items-center gap-2 text-sm text-bone/50">
                <MapPin size={14} /> Mumbai, India
              </span>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-champagne/20 text-bone/50 transition-all hover:border-champagne hover:text-champagne hover:shadow-gold"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-champagne">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-bone/50 transition-colors hover:text-bone"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-champagne/10">
        <div className="container-obsidian flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-bone/30">
            © {new Date().getFullYear()} OBSIDIAN. All rights reserved.
          </p>
          {/* Payment icons */}
          <div className="flex items-center gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded border border-champagne/10 px-2 py-0.5 text-[10px] font-medium text-bone/30"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
