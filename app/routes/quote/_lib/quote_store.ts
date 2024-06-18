import * as store from "$store";

export async function getQuote(): Promise<string> {
  const quote = await store.getItem<string>(["quote"]) ?? "Nothing to see here";
  await store.removeItem(["quote", "unseen"]);
  return quote;
}

export async function setQuote(quote: string) {
  await store.setItem(["quote"], quote);
  await store.setItem(["quote", "unseen"], true);
}

export async function isQuoteUnseen(): Promise<boolean> {
  return await store.getItem(["quote", "unseen"]) ?? false;
}
