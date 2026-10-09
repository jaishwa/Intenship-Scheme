import { Hero } from "@/components/storefront/hero";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { DealsSection } from "@/components/storefront/deals-section";
import { ProductGrid } from "@/components/storefront/product-grid";
import { TrendingCarousel } from "@/components/storefront/trending-carousel";
import { ComboOffers } from "@/components/storefront/combo-offers";
import { TrustSection } from "@/components/storefront/trust-section";
import { ReviewsSection } from "@/components/storefront/reviews-section";
import { UGCGallery } from "@/components/storefront/ugc-gallery";
import { Newsletter } from "@/components/storefront/newsletter";
import { BESTSELLERS, NEW_ARRIVALS } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <DealsSection />
      
      <ProductGrid 
        title="Bestsellers"
        subtitle="Our most loved pieces, consistently perfected."
        products={BESTSELLERS}
        actionLabel="View All Bestsellers"
        actionHref="/collections/bestsellers"
      />
      
      <ProductGrid 
        title="New Arrivals"
        subtitle="The latest additions to the OBSIDIAN collection."
        products={NEW_ARRIVALS}
        actionLabel="Shop New In"
        actionHref="/collections/new-in"
      />
      
      <TrendingCarousel />
      <ComboOffers />
      <TrustSection />
      <ReviewsSection />
      <UGCGallery />
      <Newsletter />
    </>
  );
}
