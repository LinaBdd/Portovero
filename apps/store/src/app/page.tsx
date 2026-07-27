
import { Hero } from "../components/hero/Hero";
import { FeaturedCollections } from "../components/sections/featured-collections";
import {BestSellers} from "../components/sections/best-sellers/BestSellers";
import { BrandStory } from "../components/sections/brand-story";
import { WhyPortovero } from "../components/sections/why-portovero/WhyPortovero";
import { Testimonials } from "../components/sections/testimonials";
import { Newsletter } from "../components/sections/newsletter/Newsletter";
import {InstagramFeed} from "../components/sections/instagram/InstagramFeed";

export default function Home() {
  return (
    <>
      

      <main>
        <Hero />
        <FeaturedCollections />
        <BestSellers />
        <BrandStory />
        <WhyPortovero />
        <Testimonials />
        <Newsletter />
        <InstagramFeed />
      </main>
    </>
  );
}