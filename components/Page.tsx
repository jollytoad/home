import type { Children } from "$jsx/types.ts";
import { Src } from "@/components/Src.tsx";
import { UserWidget } from "@/components/UserWidget.tsx";
import { getDeferredTimeout } from "@/lib/deferrred_timeout.ts";

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
          href="https://unpkg.com/missing.css@1.0.13/dist/missing.min.css"
        />
        <link rel="stylesheet" href="/prism.css" />
        <link rel="stylesheet" href="/index.css" />

        <script
          src="https://unpkg.com/htmx.org@1.9.4"
          integrity="sha384-zUfuhFKKZCbHTY6aRR46gxiqszMk5tcHjsVFxnUo8VMus4kHGVdIYVbOYYNlKmHV"
          crossorigin="anonymous"
        />

        <script
          src="https://unpkg.com/htmx.org@1.9.4/dist/ext/sse.js"
          integrity="sha384-9sPcBiA9fhU9fq7gfjFF29VlQp6vyoGP5skQ99zfpnpCEUZ2+9f+XmIk/DGE+ndH"
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
