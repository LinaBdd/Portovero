import { Section } from "../../components/ui/section";
import { HeroContent } from "./HeroContent";
import { HeroImage } from "./HeroImage";

export function Hero() {
  return (
    <Section spacing="lg">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <HeroContent />
        <HeroImage />
      </div>
    </Section>
  );
}