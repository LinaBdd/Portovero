import Image from "next/image";

import { FaInstagram } from "react-icons/fa6";

interface Props {
  image: string;
}

export function InstagramCard({ image }: Props) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-3xl">

      <Image
        src={image}
        alt="Instagram"
        fill
        className="object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-500 group-hover:bg-black/40">

        <FaInstagram
          className="translate-y-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          color="white"
          size={36}
        />

      </div>

    </div>
  );
}