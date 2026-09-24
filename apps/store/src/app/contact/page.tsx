import { Mail, Phone, MapPin } from "lucide-react";

import { getSettings } from "../../lib/api/site";
import { ContactForm } from "./ContactForm";

export async function generateMetadata() {
  const settings = await getSettings();
  return { title: settings.contact_title || "Contact" };
}

export default async function ContactPage() {
  const settings = await getSettings();

  const rows = [
    {
      icon: Mail,
      label: "Email",
      value: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings.contact_phone,
      href: `tel:${(settings.contact_phone ?? "").replace(/\s/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Address",
      value: settings.contact_address,
      href: null,
    },
  ].filter((row) => row.value);

  return (
    <main className="bg-[#f6f4ef] text-[#1d1d1a]">
      <div className="mx-auto grid max-w-5xl gap-16 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl">
            {settings.contact_title}
          </h1>
          {settings.contact_subtitle && (
            <p className="mt-4 text-sm text-[#77756d]">
              {settings.contact_subtitle}
            </p>
          )}

          <ul className="mt-12 space-y-8 text-sm">
            {rows.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#96938a]">{label}</p>
                  {href ? <a href={href}>{value}</a> : <p>{value}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ContactForm successMessage={settings.contact_success} />
      </div>
    </main>
  );
}
