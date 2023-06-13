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
          <title>Authentication Hub</title>
          <link
            rel="stylesheet"
            href="https://unpkg.com/missing.css@1.0.9/dist/missing.min.css"
          />
          <link rel="stylesheet" href="/index.css" />

          <script src="https://accounts.google.com/gsi/client" async defer>
          </script>
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
