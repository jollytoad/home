import { getCookies, setCookie } from "@std/http/cookie";
import { ulid } from "@std/ulid";
import * as store from "@jollytoad/store";
import { getDenoKv } from "@jollytoad/store-deno-kv/get-deno-kv";

interface QuizSession {
  id?: string;
  score?: bigint;
  headers?: Headers;
}

const COOKIE_NAME = "quiz-session-id";

const KEY_PREFIX = ["quiz", "session"];

export async function getQuizSession(
  req: Request,
  reset = false,
): Promise<QuizSession> {
  if (!(await store.isWritable(KEY_PREFIX))) {
    return {};
  }

  const cookies = getCookies(req.headers);

  let id = cookies[COOKIE_NAME];

  if (!id || reset) {
    id ||= ulid();

    const kv = await getDenoKv(store, KEY_PREFIX);

    const url = new URL(req.url);

    const headers = new Headers();
    setCookie(headers, {
      name: COOKIE_NAME,
      value: id,
      domain: url.hostname,
      path: url.pathname,
    });

    if (kv) {
      // If we are using Deno.Kv we can do this atomically...
      await kv.atomic()
        .set(scoreKey(id, "correct"), new Deno.KvU64(0n))
        .set(scoreKey(id, "incorrect"), new Deno.KvU64(0n))
        .commit();
    } else {
      // Otherwise fallback to simple non-transactional setItem...
      await Promise.all([
        store.setItem(scoreKey(id, "correct"), 0),
        store.setItem(scoreKey(id, "incorrect"), 0),
      ]);
    }

    return {
      id,
      score: 0n,
      headers,
    };
  } else {
    return {
      id,
      score: await getScore(id),
    };
  }
}

export async function updateQuizScore(
  id: string,
  correct: boolean,
): Promise<QuizSession> {
  const kv = await getDenoKv(store, KEY_PREFIX);

  const key = scoreKey(id, correct ? "correct" : "incorrect");

  if (kv) {
    // If we are using Deno.Kv we can increment atomically...
    await kv.atomic().mutate({
      type: "sum",
      key,
      value: new Deno.KvU64(1n),
    }).commit();
  } else {
    // Otherwise fallback to the slightly risky getItem, increment & setItem...
    await store.setItem(key, (await store.getItem<number>(key) ?? 0) + 1);
  }

  return {
    id,
    score: await getScore(id),
  };
}

function scoreKey(id: string, counter: "correct" | "incorrect") {
  return [...KEY_PREFIX, id, counter];
}

async function getScore(id: string): Promise<bigint> {
  // We can just use getItem here, but be aware that we could get a number or a bigint
  const [correct, incorrect] = await Promise.all([
    await store.getItem<bigint | number>(scoreKey(id, "correct")),
    await store.getItem<bigint | number>(scoreKey(id, "incorrect")),
  ]);
  return BigInt(correct ?? 0n) - BigInt(incorrect ?? 0n);
}
