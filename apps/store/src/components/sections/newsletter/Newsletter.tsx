import { ArrowRight } from "lucide-react";

import { Button } from "../../ui/button";
import { Container } from "../../ui/container";

export function Newsletter() {
  return (
    <section className="bg-[#111111] py-28 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">

          <span className="mb-4 block uppercase tracking-[0.3em] text-[#C8A96A]">
            Newsletter
          </span>

          <h2 className="font-serif text-5xl">
            Join the Portovero Club
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-neutral-300 leading-8">
            Receive exclusive collections, early access and luxury fashion
            inspiration directly in your inbox.
          </p>

          <form className="mt-12 flex flex-col gap-4 md:flex-row">

            <input
              type="email"
              placeholder="Enter your email"
              className="h-14 flex-1 rounded-full border border-neutral-700 bg-transparent px-6 outline-none transition focus:border-[#C8A96A]"
            />

            <Button variant="luxury" size="lg">
              Subscribe
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

          </form>

        </div>
      </Container>
    </section>
  );
}