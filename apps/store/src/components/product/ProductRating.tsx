import { Star } from "lucide-react";

interface Props {
  rating: number;
  reviews: number;
}

export function ProductRating({
  rating,
  reviews,
}: Props) {
  return (
    <div className="flex items-center gap-2">

      <Star
        size={16}
        className="fill-yellow-400 text-yellow-400"
      />

      <span className="text-sm">
        {rating}
      </span>

      <span className="text-sm text-neutral-500">
        ({reviews})
      </span>

    </div>
  );
}