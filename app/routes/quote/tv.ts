import { byMethod } from "@http/route/by-method";
import { renderHTML } from "../../lib/render_html.tsx";
import { QuoteTvPage } from "./_components/QuoteTvPage.tsx";
import { getQuoteConfig } from "./_lib/quote_config.ts";

export default byMethod({
  GET: (req, _match) => {
    return renderHTML(QuoteTvPage, { refresh: getRefresh(req) });
  },
});

function getRefresh(req: Request) {
  return parseInt(new URL(req.url).searchParams.get("refresh") ?? "") ||
    getQuoteConfig().refresh;
}
