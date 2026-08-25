import "./globals.css";
import { AdminGuard } from "../components/AdminGuard";
import { AdminShell } from "../components/AdminShell";

export const metadata = {
  title: "Portovero Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex bg-neutral-50">
        <AdminGuard>
          <AdminShell>{children}</AdminShell>
        </AdminGuard>
      </body>
    </html>
  );
}