import { Heart, ShoppingBag } from "lucide-react";

export function ProductActions() {
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition duration-300 group-hover:opacity-100">

      <button className="rounded-full bg-white p-3 shadow">
        <Heart size={18} />
      </button>

      <button className="rounded-full bg-white p-3 shadow">
        <ShoppingBag size={18} />
      </button>

    </div>
  );
}