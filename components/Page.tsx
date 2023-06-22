import type { Children } from "$jsx/types.ts";

interface Props {
  children?: Children;
  reqURL?: string;
}

export function Page({ children, reqURL, ...props }: Props) {
  return reqURL
    ? <>{children}</>
    : (
      <html hx-ext="css-rules" data-host-app="authenticate">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Jollytoad</title>
          <link
            rel="stylesheet"
            href="https://unpkg.com/missing.css@1.0.9/dist/missing.min.css"
          />
          <link rel="stylesheet" href="/index.css" />

          <script
            src="https://unpkg.com/htmx.org@1.9.2"
            integrity="sha384-L6OqL9pRWyyFU3+/bjdSri+iIphTN/bvYyM37tICVyOJkWZLpP2vGn6VUEXgzg6h"
            crossorigin="anonymous"
            async
          />

          <script src="https://accounts.google.com/gsi/client" async defer />
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
            <div>©️ 2023 Mark Gibson</div>
          </footer>
        </body>
      </html>
    );
}
