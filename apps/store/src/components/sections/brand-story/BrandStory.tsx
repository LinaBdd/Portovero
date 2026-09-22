import { Section } from "../../ui/section";
import { getSettings, mediaUrl } from "../../../lib/api/site";
import { BrandContent } from "./BrandContent";
import { BrandImage } from "./BrandImage";

export async function BrandStory() {
  const settings = await getSettings();

  if (!settings.story_title && !settings.story_text) return null;

  return (
    <Section spacing="lg">
      <div className="grid items-center gap-20 lg:grid-cols-2">
        <BrandImage
          src={mediaUrl(settings.story_image)}
          alt={settings.brand_name}
        />

        <BrandContent
          eyebrow={settings.story_eyebrow}
          title={settings.story_title}
          text={settings.story_text}
          ctaLabel={settings.story_cta_label}
        />
      </div>
    </Section>
  );
}
