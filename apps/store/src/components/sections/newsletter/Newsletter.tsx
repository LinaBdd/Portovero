import { Container } from "../../ui/container";
import { getSettings } from "../../../lib/api/site";
import { NewsletterForm } from "./NewsletterForm";

export async function Newsletter() {
  const settings = await getSettings();

  return (
    <section className="bg-[#111111] py-28 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 block uppercase tracking-[0.3em] text-[#C8A96A]">
            Newsletter
          </span>

          <h2 className="font-serif text-5xl">{settings.newsletter_title}</h2>

          {settings.newsletter_text && (
            <p className="mx-auto mt-6 max-w-xl text-neutral-300 leading-8">
              {settings.newsletter_text}
            </p>
          )}

          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}
