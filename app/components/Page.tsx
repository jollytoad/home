import type { Children } from "@http/jsx-stream/types";
import { Src } from "../components/Src.tsx";
import { DevScript } from "./DevScript.tsx";
import type { RequestProps } from "../lib/types.ts";
import { getEnv } from "../lib/env.ts";

interface Props extends RequestProps {
  children?: Children;
  reqURL?: string;
  module?: string | URL;
}

export function Page({ req, children, reqURL, module }: Props) {
  return reqURL ? <>{children}</> : (
    <html lang="en-GB">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Ramblings and experiments" />
        <title>Jollytoad</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/missing.css@1.1.3/dist/missing.min.css"
          integrity="sha384-qZFYlw2B1UM516YRx4hSbZ/hoB1pKQObWWpcVXira7ZSpjf5NkrwpJuSpuGuu2WS"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="/prism.css" />
        <link rel="stylesheet" href="/main.css" />

        <script
          src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.3/dist/htmx.min.js"
          integrity="sha384-0895/pl2MU10Hqc6jd4RvrthNlDiE9U1tWmX7WRESftEDRosgxNsQG/Ze9YMRzHq"
          crossorigin="anonymous"
          defer
        />

        <script
          src="https://cdn.jsdelivr.net/npm/htmx-ext-sse@2.2.2/sse.js"
          integrity="sha384-fw+eTlCc7suMV/1w/7fr2/PmwElUIt5i82bi+qTiLXvjRXZ2/FkiTNA/w0MhXnGI"
          crossorigin="anonymous"
          defer
        />

        <script src="/app.js" type="module" />

        <DevScript
          req={req}
          src="/dev/auto-refresh/dev.js"
          envVar="AUTO_REFRESH"
        />
        <DevScript
          req={req}
          src="/dev/src-link/dev.js"
          params={{
            attr: getEnv("JSX_SRC_ATTR", req),
          }}
          envVar="SRC_LINK"
        />
      </head>
      <body>
        <header>
          <h1>
            <a href="/">The home of Jollytoad</a>
          </h1>
        </header>

        <main>
          {children}
        </main>

        <footer>
          <Src module={module} />
          <div>©️ {new Date().getFullYear()} Mark Gibson</div>
        </footer>

        <script src="/ready.js" defer />
      </body>
    </html>
  );
}
