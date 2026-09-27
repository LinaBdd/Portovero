
import { Hero } from "../components/hero/Hero";

import {BestSellers} from "../components/sections/best-sellers/BestSellers";
import { ShopPreview } from "../components/sections/shop-preview/ShopPreview";
import { BrandStory } from "../components/sections/brand-story";
import { WhyPortovero } from "../components/sections/why-portovero/WhyPortovero";
import { Testimonials } from "../components/sections/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <BestSellers />
      <ShopPreview />
      <WhyPortovero />
      <Testimonials />
      <BrandStory />
    </main>
  );
}