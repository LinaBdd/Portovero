import { Section } from "../../ui/section";
import { BrandContent } from "./BrandContent";
import { BrandImage } from "./BrandImage";

export function BrandStory() {
  return (
    <Section spacing="lg">

      <div className="grid items-center gap-20 lg:grid-cols-2">

        <BrandImage />

        <BrandContent />

      </div>

    </Section>
  );
}