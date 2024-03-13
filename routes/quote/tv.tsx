import { Page } from "../../components/Page.tsx";
import { renderPage } from "../../lib/handle_page.ts";
import { byMethod } from "@http/fns/by_method";
import { Quote } from "./_components/Quote.tsx";

export default byMethod({
  GET: (req, match: URLPatternResult) => {
    return renderPage(() => (
      <html lang="en-GB">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta http-equiv="refresh" content="900" />
          <link rel="stylesheet" href="/quote_tv.css" />
        </head>
        <body>
          <Quote />
        </body>
      </html>
    ))(req, match);
  },
});
