import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";

import { testimonials } from "./data";
import { TestimonialCard } from "./TestimonialCard";

export function Testimonials() {
  return (
    <Section>

      <div className="mx-auto mb-16 max-w-2xl text-center">

        <H2>
          Loved by Our Customers
        </H2>

        <Lead>
          Discover why Portovero is becoming the reference
          for timeless luxury fashion.
        </Lead>

      </div>

      <div className="grid gap-8 md:grid-cols-3">

        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
          />
        ))}

      </div>

    </Section>
  );
}