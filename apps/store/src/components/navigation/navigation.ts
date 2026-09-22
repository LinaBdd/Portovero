import type { Category } from "../../lib/api/categories";
import { categoryHref } from "../../lib/api/categories";

export interface NavItem {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
}

/** Menu principal : les sous-menus de la boutique viennent des catégories actives (admin). */
export function buildNavigation(categories: Category[]): NavItem[] {
  return [
    { label: "Home", href: "/" },
    {
      label: "Shop",
      href: "/shop",
      children: categories.map((category) => ({
        label: category.name,
        href: categoryHref(category.slug),
      })),
    },
    // Collections : prévu pour une prochaine version, retiré du menu pour le moment.
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
}
