"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  LogOut,
  Palette,
  Ruler,
  Truck,
  Users,
  Settings,
  Image as ImageIcon,
  FileText,
  Mail,
} from "lucide-react";
import { useAdminAuth } from "../store/auth";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produits", icon: Package },
  { href: "/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/categories", label: "Catégories", icon: Tags },
  { href: "/colors", label: "Couleurs", icon: Palette },
  { href: "/sizes", label: "Tailles", icon: Ruler },
  { href: "/delivery", label: "Livraison", icon: Truck },
  { href: "/users", label: "Clients", icon: Users },
  { href: "/banners", label: "Bannières", icon: ImageIcon },
  { href: "/content", label: "Contenu", icon: FileText },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#0F1B2D] text-[#e9e4d8]">
      <div className="border-b border-white/10 px-6 py-7">
        <h1 className="font-heading text-2xl tracking-[0.2em] text-white">
          PORTOVERO
        </h1>
        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#b8a98c]">
          Admin
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-[#b9b5aa] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} strokeWidth={1.6} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="mb-2 truncate text-sm text-[#b9b5aa]">
          {user?.first_name} {user?.last_name}
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-[#d9a5a0] hover:text-white"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}