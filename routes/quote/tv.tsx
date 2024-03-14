import { Page } from "../../components/Page.tsx";
import { renderPage } from "../../lib/handle_page.ts";
import { byMethod } from "@http/fns/by_method";
import { Quote } from "./_components/Quote.tsx";
import { getSearchValues } from "jsr:@http/fns@^0.6.3/request/search_values";

export default byMethod({
  GET: (req, match: URLPatternResult) => {
    const refresh = getSearchValues(req)("refresh")[0] ??
      Deno.env.get("QUOTE_TV_REFRESH") ?? "420";
    return renderPage(() => (
      <html lang="en-GB">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="refresh" content={refresh} />
          <link rel="stylesheet" href="tv.css" />
          <script src="tv.js" defer />
        </head>
        <body>
          <Quote />
        </body>
      </html>
    ))(req, match);
  },
});
