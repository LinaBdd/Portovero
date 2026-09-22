import Link from "next/link";

import { FaqAccordion } from "../../components/faq/FaqAccordion";
import { getContent, getSettings } from "../../lib/api/site";

export async function generateMetadata() {
  const settings = await getSettings();
  return { title: settings.faq_title || "FAQ" };
}

export default async function FaqPage() {
  const [settings, faq] = await Promise.all([
    getSettings(),
    getContent("faq"),
  ]);

  const items = faq.map((item) => ({ q: item.title, a: item.text ?? "" }));

  return (
    <main className="bg-[#f6f4ef] text-[#1d1d1a]">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="mb-12 font-heading text-4xl md:text-5xl">
          {settings.faq_title}
        </h1>

        {items.length > 0 ? (
          <FaqAccordion items={items} />
        ) : null}

        <p className="mt-12 text-sm text-[#77756d]">
          <Link href="/contact" className="underline underline-offset-4">
            {settings.contact_title}
          </Link>
        </p>
      </div>
    </main>
  );
}
