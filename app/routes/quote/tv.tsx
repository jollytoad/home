import { byMethod } from "@http/route/by-method";
import { QuoteTvPage } from "./_components/QuoteTvPage.tsx";
import { getQuoteConfig } from "./_lib/quote_config.ts";
import { renderHtmlResponse } from "@http/html-stream/render-html-response";

export default byMethod({
  GET: (req, _match) => {
    return renderHtmlResponse(<QuoteTvPage refresh={getRefresh(req)} />);
  },
});

function getRefresh(req: Request) {
  return parseInt(new URL(req.url).searchParams.get("refresh") ?? "") ||
    getQuoteConfig().refresh;
}
