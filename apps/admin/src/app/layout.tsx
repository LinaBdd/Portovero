import "./globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AdminGuard } from "../components/AdminGuard";
import { AdminShell } from "../components/AdminShell";

const heading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Portovero Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${heading.variable} ${sans.variable}`}>
      <body className="flex min-h-screen bg-background font-sans text-foreground">
        <AdminGuard>
          <AdminShell>{children}</AdminShell>
        </AdminGuard>
      </body>
    </html>
  );
}