import { Button } from "../../ui/button";
import { H2, Lead } from "../../ui/typography";

export function BrandContent() {
  return (
    <div className="space-y-8">

      <span className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        Our Story
      </span>

      <H2>
        Designed for timeless elegance.
      </H2>

      <Lead>
        Portovero celebrates Mediterranean simplicity with
        carefully selected pieces that combine premium
        craftsmanship, comfort and effortless sophistication.
      </Lead>

      <Button size="lg">
        Discover Our Story
      </Button>

    </div>
  );
}