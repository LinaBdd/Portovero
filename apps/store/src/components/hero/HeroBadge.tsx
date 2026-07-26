import { Sparkles } from "lucide-react";

export function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm shadow-sm">
      <Sparkles size={16} />
      <span>Summer Collection 2026</span>
    </div>
  );
}