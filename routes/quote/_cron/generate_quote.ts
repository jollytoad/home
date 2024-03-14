import { isQuoteUnseen } from "../_lib/quote_store.ts";
import { setQuote } from "../_lib/quote_store.ts";
import OpenAI from "npm:openai";

export const name = "Generate a new quote of the moment";

export const schedule = Deno.env.get("QUOTE_SCHEDULE") ?? "*/5 * * * *";

export default async function generateQuote() {
  if (await isQuoteUnseen()) {
    console.log("Skipping quote generation");
    return;
  }

  console.log("Generating a new quote...");

  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 1.5,
    messages: [
      {
        role: "user",
        content:
          "Generate a new obscure inspirational quote of the day. Do not attribute it to anyone.",
      },
    ],
  });

  const content = completion?.choices[0]?.message.content;

  if (content) {
    console.log(content);
    await setQuote(content);
  }
}

export const init = generateQuote;
