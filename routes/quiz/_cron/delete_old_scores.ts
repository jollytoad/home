import { getQuizConfig } from "../_lib/quiz_config.ts";
import { deleteQuizScores } from "../_lib/session.ts";

export const name = "Delete old quiz scores";

const config = getQuizConfig();

export const schedule = config.schedule;

export default async function deleteOldScores() {
  using kv = await Deno.openKv();

  console.log(`Deleting old quiz scores...`, config);

  const count = await deleteQuizScores(config.scoreExpiryAge, kv);

  if (count) {
    console.log(`Deleted ${count} expired quiz scores`);
  }
}
