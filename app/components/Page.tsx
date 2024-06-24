import type { Children } from "@http/jsx-stream/types";
import { Src } from "../components/Src.tsx";
import { AutoRefreshScript } from "./AutoRefreshScript.tsx";

interface Props {
  req?: Request;
  children?: Children;
  reqURL?: string;
  module?: string | URL;
}

export function Page({ children, reqURL, module }: Props) {
  return reqURL ? <>{children}</> : (
    <html lang="en-GB">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Jollytoad</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/missing.css@1.1.2/dist/missing.min.css"
          integrity="sha384-fZrde2RUAJaQbjI1/XiJmfPWyrv5awDSR64gM3lJz73T3B1Up8lhRsjemC337rRP"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="/prism.css" />
        <link rel="stylesheet" href="/main.css" />

        <script
          src="https://unpkg.com/htmx.org@2.0.0/dist/htmx.min.js"
          integrity="sha384-wS5l5IKJBvK6sPTKa2WZ1js3d947pvWXbPJ1OmWfEuxLgeHcEbjUUA5i9V5ZkpCw"
          crossorigin="anonymous"
        />

        <script
          src="https://unpkg.com/htmx-ext-sse@2.1.0/sse.js"
          integrity="sha384-CDYsGxdhlGy3oWbMF4VDUFJhjkVnh7gXN/mmG3smuZLFzha5fMAvoACJFQrSF38W"
          crossorigin="anonymous"
        />

        <script src="/app.js" type="module" />

        <AutoRefreshScript />
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
