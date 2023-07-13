import type { Children } from "$jsx/types.ts";
import { Src } from "@/components/Src.tsx";
import { UserWidget } from "@/components/UserWidget.tsx";

interface Props {
  req?: Request;
  children?: Children;
  reqURL?: string;
  module?: string;
}

export function Page({ req, children, reqURL, module, ...props }: Props) {
  return reqURL ? <>{children}</> : (
    <html lang="en-GB">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Jollytoad</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/missing.css@1.0.9/dist/missing.min.css"
        />
        <link rel="stylesheet" href="/prism.css" />
        <link rel="stylesheet" href="/index.css" />

        <script
          src="https://unpkg.com/htmx.org@1.9.2"
          integrity="sha384-L6OqL9pRWyyFU3+/bjdSri+iIphTN/bvYyM37tICVyOJkWZLpP2vGn6VUEXgzg6h"
          crossorigin="anonymous"
          async
        />

        <script src="/app.js" type="module" />
      </head>
      <body>
        <header>
          <h1>
            <a href="/">The home of Jollytoad</a>
          </h1>
          <UserWidget req={req} />
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
