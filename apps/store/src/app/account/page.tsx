"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  LogOut,
  Package,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../store/auth";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/account/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#172B3A]">

      {/* Header */}
      <section className="mx-auto max-w-[1200px] px-6 pb-12 pt-16 sm:px-8 lg:px-12 lg:pt-24">

        <div className="border-b border-[#DCD5CA] pb-10">

          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#A68B57]">
            Portovero
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="font-heading text-5xl font-medium tracking-[-0.045em] sm:text-6xl">
                Bonjour, {user.first_name}
              </h1>

              <p className="mt-4 text-sm text-[#766F66]">
                Bienvenue dans votre espace personnel.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-[#172B3A]">
                {user.phone}
              </p>

              {user.email && (
                <p className="mt-1 text-xs text-[#8A837A]">
                  {user.email}
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Account content */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 sm:px-8 lg:px-12">

        <div className="grid gap-14 lg:grid-cols-[240px_minmax(0,1fr)]">

          {/* Sidebar */}
          <aside>
            <div className="flex items-center gap-3 border-b border-[#DCD5CA] pb-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E1D5]">
                <UserRound
                  size={17}
                  strokeWidth={1.5}
                  className="text-[#A68B57]"
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  {user.first_name} {user.last_name}
                </p>

                <p className="mt-0.5 text-xs text-[#8A837A]">
                  Mon compte
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                mt-6
                flex
                items-center
                gap-2
                text-xs
                text-[#8A837A]
                transition-colors
                hover:text-red-600
              "
            >
              <LogOut size={14} strokeWidth={1.5} />
              Se déconnecter
            </button>
          </aside>

          {/* Main actions */}
          <div>

            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#A68B57]">
                Votre espace
              </p>

              <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
                Mes activités
              </h2>
            </div>

            <div className="divide-y divide-[#DCD5CA] border-y border-[#DCD5CA]">

              {/* Orders */}
              <Link
                href="/account/orders"
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-6
                  py-7
                  transition-colors
                  hover:bg-[#F3EEE6]
                  sm:px-5
                "
              >
                <div className="flex items-start gap-5">

                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1D5]">
                    <Package
                      size={17}
                      strokeWidth={1.4}
                      className="text-[#A68B57]"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-medium">
                      Mes commandes
                    </h3>

                    <p className="mt-1 text-sm text-[#8A837A]">
                      Consultez et suivez vos commandes.
                    </p>
                  </div>

                </div>

                <ArrowRight
                  size={18}
                  strokeWidth={1.4}
                  className="
                    shrink-0
                    text-[#A68B57]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-6
                  py-7
                  transition-colors
                  hover:bg-[#F3EEE6]
                  sm:px-5
                "
              >
                <div className="flex items-start gap-5">

                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1D5]">
                    <Heart
                      size={17}
                      strokeWidth={1.4}
                      className="text-[#A68B57]"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-medium">
                      Ma liste de souhaits
                    </h3>

                    <p className="mt-1 text-sm text-[#8A837A]">
                      Retrouvez les pièces que vous avez sauvegardées.
                    </p>
                  </div>

                </div>

                <ArrowRight
                  size={18}
                  strokeWidth={1.4}
                  className="
                    shrink-0
                    text-[#A68B57]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

            </div>

            {/* Account information */}
            <div className="mt-14">

              <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#A68B57]">
                Informations
              </p>

              <div className="grid gap-6 border-t border-[#DCD5CA] pt-6 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-[#8A837A]">
                    Nom complet
                  </p>

                  <p className="mt-1 text-sm">
                    {user.first_name} {user.last_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8A837A]">
                    Téléphone
                  </p>

                  <p className="mt-1 text-sm">
                    {user.phone}
                  </p>
                </div>

                {user.email && (
                  <div>
                    <p className="text-xs text-[#8A837A]">
                      Adresse email
                    </p>

                    <p className="mt-1 text-sm">
                      {user.email}
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}