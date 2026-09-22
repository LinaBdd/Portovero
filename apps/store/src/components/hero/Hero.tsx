import Link from "next/link";

import {
  getBanners,
  getCategories,
  getSettings,
  mediaUrl,
  type Banner,
  type Category,
} from "../../lib/api/site";
import { categoryHref, categoryImage, FABRICS, TWILL } from "../../lib/api/categories";

const serif = {
  fontFamily:
    'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
};
const sans = {
  fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
};

const shade = "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.22))";

function BannerPanel({ banner }: { banner: Banner }) {
  const image = mediaUrl(banner.image_url);
  const content = (
    <div
      className="relative flex h-[360px] items-end overflow-hidden bg-[#d2c6ad] bg-cover bg-center md:h-[560px]"
      style={{
        backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.45)), url('${image}')`,
      }}
    >
      <div className="p-6 text-white">
        {banner.subtitle && (
          <p className="text-[11px] tracking-[0.2em] opacity-80">{banner.subtitle}</p>
        )}
        <p className="mt-1 text-2xl" style={{ ...serif, fontWeight: 500 }}>
          {banner.title}
        </p>
        {banner.description && (
          <p className="mt-2 max-w-sm text-sm opacity-85">{banner.description}</p>
        )}
        {banner.button_text && (
          <span className="mt-4 inline-block border border-white/70 px-5 py-2 text-xs tracking-[0.18em]">
            {banner.button_text}
          </span>
        )}
      </div>
    </div>
  );

  return banner.button_link ? (
    <Link href={banner.button_link} aria-label={banner.title}>
      {content}
    </Link>
  ) : (
    content
  );
}

function CategoryPanel({ categories }: { categories: Category[] }) {
  return (
    <div className="flex h-[360px] gap-2 md:h-[560px]">
      {categories.map((category, index) => {
        const fabric = FABRICS[index % FABRICS.length];
        const image = categoryImage(category.image);

        return (
          <Link
            key={category.id}
            href={categoryHref(category.slug)}
            aria-label={category.name}
            className="group relative flex flex-1 items-end overflow-hidden transition-[flex-grow] duration-500 hover:flex-[1.7] focus-visible:flex-[1.7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2D52] motion-reduce:transition-none"
            style={{
              backgroundColor: fabric.bg,
              backgroundImage: image
                ? `${shade}, url('${image}')`
                : `${shade}, ${TWILL}`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: fabric.fg,
            }}
          >
            <div className="w-full p-4">
              <p className="text-sm" style={{ ...serif, fontWeight: 500 }}>
                {category.name}
              </p>
              {category.description && (
                <p className="mt-0.5 line-clamp-1 text-[11px] opacity-75">
                  {category.description}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export async function Hero() {
  const [settings, banners, categories] = await Promise.all([
    getSettings(),
    getBanners(),
    getCategories(),
  ]);

  const banner = banners[0];
  const swatches = categories.slice(0, 4);
  const titleLines = (settings.hero_title ?? "").split("\n");

  return (
    <section className="bg-[#f6f4ef] text-[#1d1d1a]" style={sans}>
      <div className="mx-auto grid min-h-[calc(100svh-78px)] max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-[1.05fr_1fr] md:gap-16 md:py-16">
        <div>
          {settings.hero_eyebrow && (
            <p className="mb-6 text-xs tracking-[0.22em] text-[#77756d]">
              {settings.hero_eyebrow}
            </p>
          )}

          <h1
            className="text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[1.02] tracking-[-0.01em]"
            style={{ ...serif, fontWeight: 500 }}
          >
            {titleLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          {settings.hero_subtitle && (
            <p className="mt-8 max-w-md text-[15px] leading-7 text-[#5f5d56]">
              {settings.hero_subtitle}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            {settings.hero_cta_label && (
              <Link
                href={settings.hero_cta_link || "/shop"}
                className="bg-[#0F2D52] px-8 py-3.5 text-xs tracking-[0.18em] text-white transition hover:bg-[#0c2444] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2D52]"
              >
                {settings.hero_cta_label}
              </Link>
            )}
            {settings.hero_cta2_label && (
              <Link
                href={settings.hero_cta2_link || "/about"}
                className="border border-[#1d1d1a]/40 px-8 py-3.5 text-xs tracking-[0.18em] transition hover:border-[#1d1d1a] hover:bg-[#1d1d1a]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2D52]"
              >
                {settings.hero_cta2_label}
              </Link>
            )}
          </div>
        </div>

        <div>
          {banner ? (
            <BannerPanel banner={banner} />
          ) : swatches.length > 0 ? (
            <CategoryPanel categories={swatches} />
          ) : null}
          {settings.hero_caption && (
            <p className="mt-4 text-xs text-[#77756d]">{settings.hero_caption}</p>
          )}
        </div>
      </div>
    </section>
  );
}
