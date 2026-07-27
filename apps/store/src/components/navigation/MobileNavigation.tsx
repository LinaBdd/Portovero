"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navigation } from "./navigation";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-7 w-7" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50">

          <div className="h-full w-72 bg-white p-8 shadow-xl">

            <div className="mb-10 flex justify-end">

              <button
                onClick={() => setOpen(false)}
              >
                <X className="h-7 w-7" />
              </button>

            </div>

            <nav>

              <ul className="space-y-8">

                {navigation.map((item) => (

                  <li key={item.href}>

                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-2xl font-medium transition hover:text-[#C8A96A]"
                    >
                      {item.label}
                    </Link>

                  </li>

                ))}

              </ul>

            </nav>

          </div>

        </div>
      )}
    </>
  );
}