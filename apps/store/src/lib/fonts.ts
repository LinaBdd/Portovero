import { Cormorant_Garamond, Inter } from "next/font/google";

// Polices du site. Les variables CSS servent au hero, aux pages et au layout.
export const heading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-cormorant",
});

export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});