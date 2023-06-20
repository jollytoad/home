import { byMethod } from "$http_fns/method.ts";
import { byMediaType } from "$http_fns/media_type.ts";
import { mapData } from "$http_fns/map.ts";
import { renderHTML } from "$http_render_fns/render_html.tsx";
import { fetchContentForPath, rawContent } from "@/lib/content.ts";
import { Blog } from "@/components/Blog.tsx";

export default byMethod({
  GET: mapData(
    fetchContentForPath(`@/blog`),
    byMediaType({
      "text/html": renderHTML(Blog),
      "text/markdown": rawContent,
      "text/plain": rawContent,
    }),
  ),
});
