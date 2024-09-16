import { getQuoteConfig } from "../_lib/quote_config.ts";
import { canSetQuote, isQuoteUnseen } from "../_lib/quote_store.ts";
import { setQuote } from "../_lib/quote_store.ts";
import OpenAI from "openai";

export const name = "Generate a new quote of the moment";

const config = getQuoteConfig();

export const schedule = config.schedule;

let disable = false;

export default async function generateQuote() {
  if (disable) return;

  if (!config.apiKey) {
    console.log(
      "Skipping quote generation - OPENAI_API_KEY environment variable is not set",
    );
    disable = true;
    return;
  }

  if (!(await canSetQuote())) {
    console.log("Skipping quote generation - store is not writeable");
    disable = true;
    return;
  }

  if (await isQuoteUnseen()) {
    console.log("Skipping quote generation - current quote is unseen");
    return;
  }

  console.log("Generating a new quote...");

  try {
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });

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
  } catch (error: unknown) {
    console.error("Failed to generate new quote:\n", error);
  }
}

export const init = generateQuote;
