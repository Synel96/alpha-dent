import { ogImageUrl } from "../lib/seo";

// Link-preview image (og:image + twitter:card, rendered by vike-react).
export default function image() {
  return ogImageUrl();
}
