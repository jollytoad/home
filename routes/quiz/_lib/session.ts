import { getCookies, setCookie } from "@std/http/cookie";
import { ulid, decodeTime } from "@std/ulid";
import { getQuizConfig } from "../_lib/quiz_config.ts";

interface QuizSession {
  id: string;
  score: bigint;
  headers?: Headers;
}

const COOKIE_NAME = "quiz-session-id";
const KEY_PREFIX = ["quiz", "session"];

export async function getQuizSession(
  req: Request,
  reset = false,
): Promise<QuizSession> {
  const cookies = getCookies(req.headers);

  let id = cookies[COOKIE_NAME];

  if (id) {
    try {
      const sessionTime = decodeTime(id);
      const expiryTime = Date.now() - getQuizConfig().scoreExpiryAge;
      if (sessionTime < expiryTime) {
        console.log('EXPIRED', id, sessionTime, expiryTime);
        reset = true;
      }
    } catch {
      reset = true;
    }
  }

  using kv = await Deno.openKv();

  if (!id || reset) {
    id = ulid();

    const url = new URL(req.url);

    const headers = new Headers();
    setCookie(headers, {
      name: COOKIE_NAME,
      value: id,
      domain: url.hostname,
      path: url.pathname,
    });

    await kv.atomic()
      .set(scoreKey(id, "correct"), new Deno.KvU64(0n))
      .set(scoreKey(id, "incorrect"), new Deno.KvU64(0n))
      .commit();

    return {
      id,
      score: 0n,
      headers,
    };
  } else {
    return {
      id,
      score: await getScore(id, kv),
    };
  }
}

export async function updateQuizScore(
  id: string,
  correct: boolean,
): Promise<QuizSession> {
  using kv = await Deno.openKv();

  await kv.atomic().mutate({
    type: "sum",
    key: scoreKey(id, correct ? "correct" : "incorrect"),
    value: new Deno.KvU64(1n),
  }).commit();

  return {
    id,
    score: await getScore(id, kv),
  };
}

function scoreKey(id: string, counter: "correct" | "incorrect") {
  return [...KEY_PREFIX, id, counter];
}

async function getScore(id: string, kv: Deno.Kv): Promise<bigint> {
  const [correct, incorrect] = await Promise.all([
    await kv.get<Deno.KvU64>(scoreKey(id, "correct")),
    await kv.get<Deno.KvU64>(scoreKey(id, "incorrect")),
  ]);
  return (correct.value?.value ?? 0n) - (incorrect.value?.value ?? 0n);
}

async function deleteScore(id: string, kv: Deno.Kv): Promise<boolean> {
  return (await kv.atomic()
    .delete(scoreKey(id, "correct"))
    .delete(scoreKey(id, "incorrect"))
    .commit()).ok;
}

export async function deleteQuizScores(
  age: number,
  kv: Deno.Kv,
): Promise<number> {
  console.log("age", age);
  const expiryTimestamp = Date.now() - age;
  let id: string = "";
  const deletions: Promise<boolean>[] = [];

  const selector = {
    prefix: KEY_PREFIX,
    end: [...KEY_PREFIX, ulidFrom(expiryTimestamp)],
  }

  console.log(selector);

  for await (
    const entry of kv.list(selector)
  ) {
    console.log(entry);
    const nextId = entry.key[KEY_PREFIX.length];
    if (typeof nextId === "string" && nextId !== id) {
      id = nextId;
      deletions.push(deleteScore(id, kv));
    }
  }

  return (await Promise.all(deletions)).reduce(
    (count, success) => count + (success ? 1 : 0),
    0,
  );
}

function ulidFrom(timestamp: number) {
  return ulid(timestamp).slice(0, 10) + "0".repeat(16);
}
