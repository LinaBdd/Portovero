"use client";

import Link from "next/link";
import { navigation } from "./navigation";

export function DesktopNavigation() {
  return (
    <nav className="hidden lg:block">

      <ul className="flex items-center gap-10">

        {navigation.map((item) => (

          <li
            key={item.href}
            className="group relative"
          >

            <Link
              href={item.href}
              className="
                relative
                py-8
                transition
                hover:text-[#C8A96A]
              "
            >
              {item.label}

              <span
                className="
                  absolute
                  left-0
                  -bottom-2
                  h-[2px]
                  w-0
                  bg-[#C8A96A]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>

            {item.children && (

              <div
                className="
                  invisible
                  absolute
                  left-0
                  top-full
                  w-64
                  rounded-xl
                  border
                  bg-white
                  p-5
                  opacity-0
                  shadow-xl
                  transition-all
                  duration-300
                  group-hover:visible
                  group-hover:opacity-100
                "
              >

                <ul className="space-y-4">

                  {item.children.map((child) => (

                    <li key={child.href}>

                      <Link
                        href={child.href}
                        className="
                          block
                          transition
                          hover:text-[#C8A96A]
                        "
                      >
                        {child.label}
                      </Link>

                    </li>

                  ))}

                </ul>

              </div>

            )}

          </li>

        ))}

      </ul>

    </nav>
  );
}