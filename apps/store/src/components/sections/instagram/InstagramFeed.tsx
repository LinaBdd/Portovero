import { FaInstagram } from "react-icons/fa6";
import { Section } from "../../ui/section";
import { Button } from "../../ui/button";
import { H2, Lead } from "../../ui/typography";

import { InstagramCard } from "./InstagramCard";
import { instagramPosts } from "./data";

export function InstagramFeed() {
  return (
    <Section>

      <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">

        <div>

          <H2>
            Follow us on Instagram
          </H2>

          <Lead>
            Discover our latest collections and everyday inspiration.
          </Lead>

        </div>

        <Button variant="outline">

          <FaInstagram className="mr-2 h-5 w-5"/>

          @portovero

        </Button>

      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">

        {instagramPosts.map((image) => (

          <InstagramCard
            key={image}
            image={image}
          />

        ))}

      </div>

    </Section>
  );
}