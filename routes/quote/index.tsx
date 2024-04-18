import { Page } from "../../components/Page.tsx";
import { renderPage } from "../../lib/handle_page.ts";
import { byMethod } from "@http/route/by-method";
import { Quote } from "./_components/Quote.tsx";
import { getQuoteConfig } from "./_lib/quote_config.ts";
import { Src } from "../../components/Src.tsx";

export default byMethod({
  GET: (req, match: URLPatternResult) => {
    const config = getQuoteConfig();
    return renderPage(() => (
      <Page req={req} module={import.meta.url}>
        <h2>Quote of the moment:</h2>

        <Quote />

        <p>
          Try <a href="/quote/tv">immersive mode</a>, which refreshes every{" "}
          {config.refresh} seconds.
        </p>

        <details>
          <summary>How this works...</summary>
          <p>
            Quotes are updated using{" "}
            <a href="https://deno.com/blog/cron" target="_blank">Deno Cron</a>,
            with the schedule: &quot;<code>{config.schedule}</code>&quot;, and
            stored using{" "}
            <a href="https://deno.com/blog/kv" target="_blank">Deno Kv</a>.
          </p>

          <p>
            It uses OpenAI to generate the quote, using the "{config.model}"
            model with a temperature of {config.temperature}{" "}
            and the following prompt:
            <blockquote>{config.prompt}</blockquote>
            These settings can be configured via environment variables.
          </p>

          <p>
            View the source:
            <ul>
              <li>
                <Src module={import.meta.resolve("./_cron/generate_quote.ts")}>
                  Quote generation cron job
                </Src>
              </li>
              <li>
                <Src module={import.meta.resolve("./_lib/quote_config.ts")}>
                  Quote configuration
                </Src>
              </li>
              <li>
                <Src module={import.meta.resolve("./_lib/quote_store.ts")}>
                  Quote storage via Kv
                </Src>
              </li>
              <li>
                <Src module={import.meta.resolve("./tv.ts")}>
                  Immersive mode route handler
                </Src>
              </li>
              <li>
                <Src module={import.meta.resolve("./_components/Quote.tsx")}>
                  Quote component
                </Src>
              </li>
              <li>
                <Src
                  module={import.meta.resolve("./_components/QuoteTvPage.tsx")}
                >
                  QuoteTvPage component (immersive mode)
                </Src>
              </li>
              <li>
                <Src module={import.meta.resolve("../../cron.ts")}>
                  Cron job registration
                </Src>
              </li>
            </ul>
          </p>
        </details>
      </Page>
    ))(req, match);
  },
});
