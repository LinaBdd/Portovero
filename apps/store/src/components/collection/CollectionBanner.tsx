import { Container } from "../ui/container";

export function CollectionBanner() {
  return (
    <section className="relative h-[420px] overflow-hidden">

      <img
        src="/images/banner/collection.jpg"
        alt="Collection"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/45" />

      <Container>

        <div className="relative z-10 flex h-[420px] flex-col justify-center text-white">

          <span className="mb-3 uppercase tracking-[0.3em] text-[#C8A96A]">
            Portovero
          </span>

          <h1 className="font-serif text-6xl">
            Men's Collection
          </h1>

          <p className="mt-5 max-w-xl text-lg text-neutral-200">
            Discover timeless elegance crafted with premium materials.
          </p>

        </div>

      </Container>

    </section>
  );
}