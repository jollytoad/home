import { getItem, isWritable, removeItem, setItem } from "@jollytoad/store";

export async function getQuote(): Promise<string> {
  const quote = await getItem<string>(["quote"]) ?? "Nothing to see here";
  await removeItem(["quote", "unseen"]);
  return quote;
}

export async function setQuote(quote: string) {
  await setItem(["quote"], quote);
  await setItem(["quote", "unseen"], true);
}

export async function isQuoteUnseen(): Promise<boolean> {
  return await getItem(["quote", "unseen"]) ?? false;
}

export function canSetQuote(): Promise<boolean> {
  return isWritable(["quote"]);
}
