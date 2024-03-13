import { setQuote } from "../_lib/quote_store.ts";
import OpenAI from "npm:openai";

export const name = "Generate a new quote of the moment";

export const schedule = Deno.env.get("QUOTE_SCHEDULE") ?? "*/30 * * * *";

export default async function generateQuote() {
  console.log("Generating a new quote...");

  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content:
          "Generate a new unique inspirational quote of the day. Do not attribute it to anyone",
      },
    ],
  });

  const content = completion?.choices[0]?.message.content;

  if (content) {
    await setQuote(content);
  }
}

export const init = generateQuote;
