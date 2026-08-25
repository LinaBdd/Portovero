import { Container } from "../ui/container";

export function CollectionBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-[#172B3A]">
      {/* Background image */}
      <img
        src="/images/banner/collection.jpg"
        alt="Men's Collection"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Soft navy overlay */}
      <div className="absolute inset-0 bg-[#172B3A]/55" />

      {/* Subtle bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#172B3A]/75 via-[#172B3A]/35 to-transparent" />

      <Container>
        <div className="relative flex min-h-[430px] items-center py-20 sm:min-h-[480px]">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-[#B89B5E]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D6B978]">
                Portovero
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[#F7F3EC] sm:text-5xl lg:text-6xl">
              Men&apos;s Collection
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#E8DED0] sm:text-base">
              Discover timeless pieces selected for a refined,
              effortless style.
            </p>

            {/* Decorative line */}
            <div className="mt-8 h-px w-16 bg-[#B89B5E]" />

          </div>
        </div>
      </Container>
    </section>
  );
}