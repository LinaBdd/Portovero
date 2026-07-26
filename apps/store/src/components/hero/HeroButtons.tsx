import { Button } from "../../components/ui/button";

export function HeroButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button size="lg">
        Shop Now
      </Button>

      <Button
        size="lg"
        variant="outline"
      >
        Discover Collection
      </Button>
    </div>
  );
}