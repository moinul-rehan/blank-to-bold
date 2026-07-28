import { Studio } from "@/features/studio/room-scene";

/**
 * Temporary preview route — NOT part of the site's real navigation.
 * Exists only so the 3D Studio room (pulled from blank-to-bold-main) can be
 * viewed locally without disturbing the Door on `/`. Remove once a real
 * decision is made about whether/where this belongs in the experience.
 */
export default function StudioPreviewPage() {
  return <Studio />;
}
