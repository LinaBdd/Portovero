"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  name: string;
  /** Pastilles affichées sur l'image, ex. ["Nouveau", "-33%"] */
  badges?: string[];
};

export function ProductGallery({ images, name, badges = [] }: Props) {
  const list = images.filter(
    (image) => typeof image === "string" && image.trim().length > 0
  );

  const count = list.length;
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const touchStart = useRef<number | null>(null);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  // Retour à la première image quand la liste change (changement de couleur)
  const signature = list.join("|");
  useEffect(() => {
    setIndex(0);
    setZoom(null);
  }, [signature]);

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  if (count === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[32px] bg-[#EFE8DC]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A8176]">
          Aucune image
        </span>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 ${
        count > 1 ? "lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-6" : ""
      }`}
    >
      {/* ====================== MINIATURES ====================== */}
      {count > 1 && (
        <div className="order-2 flex gap-3 overflow-x-auto p-1 lg:order-1 lg:flex-col lg:overflow-visible">
          {list.map((src, i) => {
            const active = i === index;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => go(i)}
                aria-label={`Voir l'image ${i + 1}`}
                aria-current={active ? "true" : undefined}
                className={`relative h-24 w-[76px] shrink-0 overflow-hidden rounded-2xl bg-white transition duration-300 lg:h-[108px] lg:w-[84px] ${
                  active
                    ? "ring-2 ring-[#172B3A] ring-offset-2 ring-offset-[#F7F3EC]"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full bg-white object-contain p-1.5"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ====================== IMAGE PRINCIPALE ====================== */}
      <div
        className="group relative order-1 aspect-[4/5] max-h-[820px] w-full cursor-zoom-in overflow-hidden rounded-[32px] bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#172B3A] lg:order-2"
        tabIndex={0}
        role="group"
        aria-roledescription="carrousel"
        aria-label={`Photos de ${name}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const rect = e.currentTarget.getBoundingClientRect();
          setZoom({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onPointerLeave={() => setZoom(null)}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 50) go(delta < 0 ? index + 1 : index - 1);
          touchStart.current = null;
        }}
      >
        {list.map((src, i) => {
          const active = i === index;
          return (
            <img
              key={`${src}-${i}`}
              src={src}
              alt={`${name} — photo ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              onError={() => {
                console.error("Image produit introuvable :", src);
                setFailed((f) => ({ ...f, [src]: true }));
              }}
              className={`absolute inset-0 h-full w-full object-contain p-4 sm:p-8 ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{
                transform: active && zoom ? "scale(1.9)" : "scale(1)",
                transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
                transition:
                  "opacity 500ms, transform 350ms cubic-bezier(.2,.7,.2,1)",
              }}
            />
          );
        })}

        {list[index] && failed[list[index]] && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-[#8A8176]">
            Image indisponible
          </div>
        )}

        {/* Pastilles */}
        {badges.length > 0 && (
          <div className="absolute left-5 top-5 flex flex-col items-start gap-2">
            {badges.map((badge, i) => (
              <span
                key={badge}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-[0.14em] ${
                  i === 0
                    ? "bg-[#172B3A] text-white"
                    : "bg-white/85 text-[#9B3D3D] backdrop-blur"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Compteur + flèches */}
        {count > 1 && (
          <>
            <p className="absolute bottom-5 left-6 text-xs tabular-nums tracking-[0.2em] text-[#172B3A]/70">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Image précédente"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#172B3A] shadow-sm backdrop-blur transition hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Image suivante"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#172B3A] shadow-sm backdrop-blur transition hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}