import { Page } from "../../components/Page.tsx";
import { renderPage } from "../../lib/handle_page.ts";
import { byMethod } from "@http/fns/by_method";
import { Quote } from "./_components/Quote.tsx";

export default byMethod({
  GET: (req, match: URLPatternResult) => {
    return renderPage(() => (
      <Page req={req} module={import.meta.url}>
        <h2>Quote of the moment:</h2>
        <Quote />
      </Page>
    ))(req, match);
  },
});
