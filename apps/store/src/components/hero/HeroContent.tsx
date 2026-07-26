import { H1, Lead } from "../../components/ui/typography";
import { HeroBadge } from "./HeroBadge";
import { HeroButtons } from "./HeroButtons";
import { HeroStats } from "./HeroStats";

export function HeroContent() {
  return (
    <div className="space-y-8">

      <HeroBadge />

      <H1>
        Timeless Mediterranean Elegance
      </H1>

      <Lead>
        Crafted for those who appreciate
        timeless style, premium quality and
        effortless confidence.
      </Lead>

      <HeroButtons />

      <HeroStats />

    </div>
  );
}