import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";

import { FeatureCard } from "./FeaturedCard";
import { features } from "./data";

export function WhyPortovero() {
  return (
    <Section>

      <div className="mx-auto mb-16 max-w-3xl text-center">

        <H2>
          Why Choose Portovero
        </H2>

        <Lead>
          Luxury isn't just about clothing.
          It's about confidence, quality and timeless style.
        </Lead>

      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            {...feature}
          />
        ))}

      </div>

    </Section>
  );
}