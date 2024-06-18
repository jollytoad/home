import { getQuote } from "../_lib/quote_store.ts";

export async function Quote() {
  const quote = await getQuote();

  return (
    <blockquote class="quote-of-the-moment">
      <p>{quote}</p>
      <footer>- a generative AI</footer>
    </blockquote>
  );
}
