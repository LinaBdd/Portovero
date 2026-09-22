import Link from "next/link";

import { withYear, type SiteSettings } from "../../lib/api/site";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  // Collections : prévu pour une prochaine version, retiré du footer pour le moment.
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: "Instagram", href: settings.instagram_url },
    { label: "Facebook", href: settings.facebook_url },
    { label: "TikTok", href: settings.tiktok_url },
  ].filter((social) => social.href);

  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-10">
        <h2 className="text-2xl font-serif tracking-[0.3em]">
          {(settings.brand_name || "Portovero").toUpperCase()}
        </h2>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-neutral-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        {socials.length > 0 && (
          <div className="flex gap-6 text-sm text-neutral-600">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
              </a>
            ))}
          </div>
        )}

        {settings.footer_copyright && (
          <p className="text-sm text-neutral-500">
            {withYear(settings.footer_copyright)}
          </p>
        )}
      </div>
    </footer>
  );
}
