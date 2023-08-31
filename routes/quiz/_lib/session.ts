import { getCookies, setCookie } from "$std/http/cookie.ts";
import { ulid } from "https://deno.land/x/ulid@v0.2.1/mod.ts";

interface QuizSession {
  id: string;
  score: bigint;
  headers?: Headers;
}

const COOKIE_NAME = "quiz-session-id";

export async function getQuizSession(
  req: Request,
  reset = false,
): Promise<QuizSession> {
  const cookies = getCookies(req.headers);

  let id = cookies[COOKIE_NAME];

  const kv = await Deno.openKv();

  try {
    if (!id || reset) {
      id ||= ulid();

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
  } finally {
    kv.close();
  }
}

export async function updateQuizScore(
  id: string,
  correct: boolean,
): Promise<QuizSession> {
  const kv = await Deno.openKv();

  try {
    await kv.atomic().mutate({
      type: "sum",
      key: scoreKey(id, correct ? "correct" : "incorrect"),
      value: new Deno.KvU64(1n),
    }).commit();

    return {
      id,
      score: await getScore(id, kv),
    };
  } finally {
    kv.close();
  }
}

function scoreKey(id: string, counter: "correct" | "incorrect") {
  return ["quiz", "session", id, counter];
}

async function getScore(id: string, kv: Deno.Kv): Promise<bigint> {
  const [correct, incorrect] = await Promise.all([
    await kv.get<Deno.KvU64>(scoreKey(id, "correct")),
    await kv.get<Deno.KvU64>(scoreKey(id, "incorrect")),
  ]);
  return (correct.value?.value ?? 0n) - (incorrect.value?.value ?? 0n);
}
