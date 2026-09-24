import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

import { Navbar } from "../components/navigation/Navbar";
import { buildNavigation } from "../components/navigation/navigation";
import { Footer } from "../components/footer";
import { getCategories, getSettings } from "../lib/api/site";
export const dynamic = "force-dynamic";
const heading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const brand = settings.brand_name || "Portovero";

  return {
    title: { default: brand, template: `%s — ${brand}` },
    description: settings.site_description,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getCategories(),
  ]);

  return (
    <html
      lang="fr"
      className={`${heading.variable} ${sans.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-screen flex-col bg-[#f6f4ef] pt-[78px] font-sans">
        <Navbar
          navigation={buildNavigation(categories)}
          brandName={settings.brand_name || "Portovero"}
        />
        <div className="flex-1">{children}</div>
        <Footer settings={settings} />
        <Toaster position="top-right" richColors closeButton duration={2500} />
      </body>
    </html>
  );
}
