export interface NavItem {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
}

export const navigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },

  {
    label: "Shop",
    href: "/shop",

    children: [
      {
        label: "Men",
        href: "/shop?gender=men",
      },

      {
        label: "Women",
        href: "/shop?gender=women",
      },

      {
        label: "New Arrivals",
        href: "/shop?sort=new",
      },

      {
        label: "Best Sellers",
        href: "/shop?sort=bestseller",
      },
    ],
  },

  {
    label: "Collections",
    href: "/collections",

    children: [
      {
        label: "Summer",
        href: "/collections/summer",
      },

      {
        label: "Winter",
        href: "/collections/winter",
      },

      {
        label: "Accessories",
        href: "/collections/accessories",
      },
    ],
  },

  {
    label: "About",
    href: "/#about",
  } ,
    {
    label: "Contact",
    href: "/#contact",
  },
];