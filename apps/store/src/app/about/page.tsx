import Link from "next/link";

import {
  getContent,
  getSettings,
  mediaUrl,
  paragraphs,
} from "../../lib/api/site";

export async function generateMetadata() {
  const settings = await getSettings();
  return { title: settings.about_eyebrow || "About" };
}

export default async function AboutPage() {
  const [settings, values] = await Promise.all([
    getSettings(),
    getContent("value"),
  ]);

  const image = mediaUrl(settings.about_image);

  return (
    <main className="bg-[#f6f4ef] text-[#1d1d1a]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:gap-20 md:py-24">
        <div className="flex flex-col justify-center">
          {settings.about_eyebrow && (
            <p className="mb-6 text-xs tracking-[0.25em] text-[#77756d]">
              {settings.about_eyebrow}
            </p>
          )}
          <h1 className="font-heading text-5xl leading-[1.05] md:text-6xl">
            {settings.about_title}
          </h1>

          <div className="mt-10 max-w-md space-y-5 text-[15px] leading-7 text-[#4a4943]">
            {paragraphs(settings.about_text).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-10 text-xs tracking-[0.3em] text-[#96938a]">
            {(settings.brand_name || "").toUpperCase()}
          </p>

          {values.length > 0 && (
            <dl className="mt-16 grid max-w-md grid-cols-3 gap-6 border-t border-[#dedbd3] pt-6">
              {values.map((value) => (
                <div key={value.id}>
                  <dt className="text-[11px] tracking-[0.2em] text-[#96938a]">
                    {value.title}
                  </dt>
                  <dd className="mt-1 text-sm">{value.text}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {image && (
          <div
            className="min-h-[420px] rounded-sm bg-[#d2c6ad] bg-cover bg-center md:min-h-[640px]"
            style={{
              backgroundImage: `linear-gradient(180deg,rgba(15,45,82,.15),rgba(0,0,0,.25)), url('${image}')`,
            }}
            role="img"
            aria-label={settings.about_image_alt}
          />
        )}
      </div>

      {settings.about_cta_label && (
        <div className="border-t border-[#dedbd3] py-16 text-center">
          <Link
            href="/shop"
            className="inline-block bg-[#0F2D52] px-8 py-3 text-xs tracking-[0.2em] text-white transition hover:bg-[#0c2444]"
          >
            {settings.about_cta_label}
          </Link>
        </div>
      )}
    </main>
  );
}
