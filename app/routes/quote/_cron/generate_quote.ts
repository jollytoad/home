import { getQuoteConfig } from "../_lib/quote_config.ts";
import { canSetQuote, isQuoteUnseen } from "../_lib/quote_store.ts";
import { setQuote } from "../_lib/quote_store.ts";
import OpenAI from "openai";

export const name = "Generate a new quote of the moment";

const config = getQuoteConfig();

export const schedule = config.schedule;

export default async function generateQuote() {
  if (!(await canSetQuote())) {
    console.log("Skipping quote generation - store is not writeable");
    return;
  }

  if (await isQuoteUnseen()) {
    console.log("Skipping quote generation - current quote is unseen");
    return;
  }

  console.log("Generating a new quote...");

  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    model: config.model,
    temperature: config.temperature,
    messages: [
      {
        role: "user",
        content: config.prompt,
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
