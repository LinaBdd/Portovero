import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";

import { getContent, getSettings } from "../../../lib/api/site";
import { TestimonialCard } from "./TestimonialCard";

export async function Testimonials() {
  const [testimonials, settings] = await Promise.all([
    getContent("testimonial"),
    getSettings(),
  ]);

  if (testimonials.length === 0) return null;

  return (
    <Section>
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <H2>{settings.testimonials_title}</H2>
        {settings.testimonials_subtitle && (
          <Lead>{settings.testimonials_subtitle}</Lead>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            name={testimonial.title}
            location={testimonial.subtitle ?? ""}
            text={testimonial.text ?? ""}
            rating={testimonial.rating ?? 5}
          />
        ))}
      </div>
    </Section>
  );
}
