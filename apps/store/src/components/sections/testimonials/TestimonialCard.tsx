import { Star } from "lucide-react";

interface Props {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export function TestimonialCard({
  name,
  location,
  text,
  rating,
}: Props) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="mb-6 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className="fill-[#C8A96A] text-[#C8A96A]"
          />
        ))}
      </div>

      <p className="mb-8 leading-8 text-neutral-600 italic">
        "{text}"
      </p>

      <div>
        <h4 className="font-semibold">
          {name}
        </h4>

        <span className="text-sm text-neutral-500">
          {location}
        </span>
      </div>

    </div>
  );
}