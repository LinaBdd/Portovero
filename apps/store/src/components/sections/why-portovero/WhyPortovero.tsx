import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";
import { FeatureCard } from "./FeaturedCard";
import { getContent, getSettings } from "../../../lib/api/site";

export async function WhyPortovero() {
  const [features, settings] = await Promise.all([
    getContent("feature"),
    getSettings(),
  ]);

  if (features.length === 0) return null;

  return (
    <Section className="px-5 py-16 sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
        {settings.why_eyebrow && (
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {settings.why_eyebrow}
          </p>
        )}

        <H2 className="text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
          {settings.why_title}
        </H2>

        {settings.why_subtitle && (
          <Lead className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            {settings.why_subtitle}
          </Lead>
        )}
      </div>

      <div className="mx-auto max-w-4xl divide-y divide-border border-y border-border">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.text ?? ""}
            iconName={feature.icon}
          />
        ))}
      </div>
    </Section>
  );
}
