import "./globals.css";
import { AdminGuard } from "../components/AdminGuard";
import { Sidebar } from "../components/Sidebar";

export const metadata = {
  title: "Portovero Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex bg-neutral-50">
        <AdminGuard>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AdminGuard>
      </body>
    </html>
  );
}

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </>
  );
}