import { Quote } from "./Quote.tsx";

export function QuoteTvPage({ refresh }: { refresh: number }) {
  return (
    <html lang="en-GB">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="refresh" content={refresh} />
        <link rel="stylesheet" href="tv.css" />
        <script src="tv.js" defer />
      </head>
      <body>
        <Quote />
      </body>
    </html>
  );
}
