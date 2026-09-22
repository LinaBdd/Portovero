import {
  BadgeCheck,
  Gem,
  Heart,
  Leaf,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";

/** Icônes proposées dans l'admin (liste à garder synchronisée avec apps/admin). */
const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Truck,
  Sparkles,
  BadgeCheck,
  Heart,
  Star,
  Package,
  Leaf,
  Gem,
};

type FeatureCardProps = {
  title: string;
  description: string;
  iconName?: string | null;
};

export function FeatureCard({
  title,
  description,
  iconName,
}: FeatureCardProps) {
  const Icon = (iconName && ICONS[iconName]) || Sparkles;

  return (
    <div className="flex items-start gap-4 py-6 sm:gap-5 sm:py-7">
      <Icon
        size={17}
        strokeWidth={1.25}
        className="mt-0.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />

      <div className="min-w-0">
        <h3 className="text-sm font-medium tracking-wide">
          {title}
        </h3>

        <p className="mt-1.5 text-xs leading-6 text-muted-foreground sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
