"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Tags, LogOut } from "lucide-react";
import { useAdminAuth } from "../store/auth";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produits", icon: Package },
  { href: "/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/categories", label: "Catégories", icon: Tags },
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
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-lg font-semibold">Portovero</h1>
        <p className="text-xs text-neutral-500">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition ${
                active ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <p className="mb-2 truncate text-sm text-neutral-600">
          {user?.first_name} {user?.last_name}
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-600 hover:underline"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}