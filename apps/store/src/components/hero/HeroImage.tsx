import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative">

      <div className="overflow-hidden rounded-[40px]">

        <Image
          src="/images/hero/hero1.jpg"
          alt="Portovero"
          width={700}
          height={900}
          priority
          className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
        />

      </div>

    </div>
  );
}