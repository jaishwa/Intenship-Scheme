import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileMenuDrawer, CartDrawer, WishlistDrawer } from '@/components/layout/Drawers';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/storefront/Hero';
import { CategoriesGrid } from '@/components/storefront/CategoriesGrid';
import { TodaysDeals } from '@/components/storefront/TodaysDeals';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { TrendingCarousel } from '@/components/storefront/TrendingCarousel';
import { ComboOffers } from '@/components/storefront/ComboOffers';
import { TrustBadges } from '@/components/storefront/TrustBadges';
import { CustomerReviews } from '@/components/storefront/CustomerReviews';
import { UGCGallery } from '@/components/storefront/UGCGallery';
import { Newsletter } from '@/components/storefront/Newsletter';
import { Toast } from '@/components/storefront/Toast';
import { QuickViewModal } from '@/components/storefront/QuickView';
import { BESTSELLERS, NEW_ARRIVALS } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <>
      {/* ── Layout Shell ── */}
      <AnnouncementBar />
      <Navbar />
      <MobileMenuDrawer />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <Toast />

      {/* ── Main Content ── */}
      <main id="main-content">
        {/* 1. Full-bleed hero */}
        <Hero />

        {/* Gold divider */}
        <div className="container-obsidian">
          <div className="divider-gold" />
        </div>

        {/* 2. Featured categories */}
        <CategoriesGrid />

        {/* 3. Today's Deals */}
        <TodaysDeals />

        {/* Gold divider */}
        <div className="container-obsidian">
          <div className="divider-gold" />
        </div>

        {/* 4. Bestsellers */}
        <ProductGrid
          title="Bestsellers"
          label="Customer Favorites"
          subtitle="Our most-loved pieces — tried, tested, and adored."
          products={BESTSELLERS}
          viewAllHref="/collections/bestsellers"
          columns={4}
        />

        {/* 5. New Arrivals */}
        <ProductGrid
          title="New Arrivals"
          label="Just Dropped"
          subtitle="The latest additions to the OBSIDIAN universe."
          products={NEW_ARRIVALS}
          viewAllHref="/collections/new-arrivals"
          columns={4}
        />

        {/* 6. Trending carousel */}
        <TrendingCarousel />

        {/* Gold divider */}
        <div className="container-obsidian">
          <div className="divider-gold" />
        </div>

        {/* 7. Combo Offers */}
        <ComboOffers />

        {/* 8. Trust Badges */}
        <TrustBadges />

        {/* 9. Customer Reviews */}
        <CustomerReviews />

        {/* 10. UGC Gallery */}
        <UGCGallery />

        {/* Gold divider */}
        <div className="container-obsidian">
          <div className="divider-gold" />
        </div>

        {/* 11. Newsletter */}
        <Newsletter />
      </main>

      {/* ── Footer ── */}
      <Footer />
    </>
  );
}
