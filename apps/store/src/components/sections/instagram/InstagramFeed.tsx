import { FaInstagram } from "react-icons/fa6";
import { Section } from "../../ui/section";
import { Button } from "../../ui/button";
import { H2 } from "../../ui/typography";

import { InstagramCard } from "./InstagramCard";
import { getContent, getSettings, mediaUrl } from "../../../lib/api/site";

export async function InstagramFeed() {
  const [posts, settings] = await Promise.all([
    getContent("instagram"),
    getSettings(),
  ]);

  if (posts.length === 0) return null;

  return (
    <Section>
      <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">
        <H2>{settings.instagram_title || "Instagram"}</H2>

        {settings.instagram_url && (
          <Button variant="outline" asChild>
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="mr-2 h-5 w-5" />
              Instagram
            </a>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {posts.map((post) => {
          const image = mediaUrl(post.image);
          return image ? (
            <InstagramCard key={post.id} image={image} href={post.link} />
          ) : null;
        })}
      </div>
    </Section>
  );
}
