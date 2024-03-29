import type { Children } from "$jsx/types";
import { Src } from "../components/Src.tsx";
import { UserWidget } from "../components/UserWidget.tsx";
import { getDeferredTimeout } from "../lib/deferred_timeout.ts";

interface Props {
  req?: Request;
  children?: Children;
  reqURL?: string;
  module?: string;
}

export function Page({ req, children, reqURL, module, ...props }: Props) {
  const deferredTimeout = req ? getDeferredTimeout(req) : false;

  return reqURL ? <>{children}</> : (
    <html lang="en-GB">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Jollytoad</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/missing.css@1.1.1/dist/missing.min.css"
          integrity="sha384-se/UYQCQ0CMlLo1I5DcMmgR8t9hjCEpTpjPu7JWzT6M4wbxzI078hgX0pxTLyyMm"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="/prism.css" />
        <link rel="stylesheet" href="/main.css" />

        <script
          src="https://unpkg.com/htmx.org@1.9.10"
          integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
          crossorigin="anonymous"
        />

        <script
          src="https://unpkg.com/htmx.org@1.9.10/dist/ext/sse.js"
          integrity="sha384-jlVlI/i5K5APUIz8cxowC1/FsCEZgsrg126wue89Np9N75pQdAzqkYYP+jsUi43W"
          crossorigin="anonymous"
        />

        <script src="/app.js" type="module" />
      </head>
      <body>
        <header>
          <h1>
            <a href="/">The home of Jollytoad</a>
          </h1>
          <UserWidget req={req} lazy={deferredTimeout === false} />
        </header>

        <main>
          {children}
        </main>

        <footer>
          <Src module={module} />
          <div>©️ {new Date().getFullYear()} Mark Gibson</div>
        </footer>
      </body>
    </html>
  );
}
