"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-[#dedbd3] border-y border-[#dedbd3]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] transition hover:text-[#0F2D52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0F2D52]"
            >
              {item.q}
              {isOpen ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            <div
              id={`faq-panel-${i}`}
              hidden={!isOpen}
              className="pb-6 pr-10 text-sm leading-7 text-[#77756d]"
            >
              {item.a}

            </div>
          </li>
        );
      })}
    </ul>
  );
}