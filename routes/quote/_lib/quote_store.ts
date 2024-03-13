import * as store from "$store";

export async function getQuote() {
  return await store.getItem<string>(["quote"]) ?? "Nothing to see here";
}

export async function setQuote(quote: string) {
  await store.setItem(["quote"], quote);
}
