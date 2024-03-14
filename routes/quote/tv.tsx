import { byMethod } from "@http/fns/by_method";
import { Quote } from "./_components/Quote.tsx";
import { renderHTML } from "../../lib/render_html.tsx";

export default byMethod({
  GET: (req) => {
    const refresh = new URL(req.url).searchParams.get("refresh") ??
      Deno.env.get("QUOTE_TV_REFRESH");

    return renderHTML(QuoteTvPage, { refresh });
  },
});

function QuoteTvPage({ refresh }: { refresh?: string | number }) {
  return (
    <html lang="en-GB">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="refresh" content={refresh ?? 420} />
        <link rel="stylesheet" href="tv.css" />
        <script src="tv.js" defer />
      </head>
      <body>
        <Quote />
      </body>
    </html>
  );
}
