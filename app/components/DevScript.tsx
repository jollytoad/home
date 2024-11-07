import { getEnv } from "../lib/env.ts";
import type { RequestProps } from "../lib/types.ts";

export function DevScript(
  { req, src, envVar }: RequestProps & { src: string; envVar: string },
) {
  const enable = getEnv(envVar, req) === "true";

  return enable ? <script src={src} type="module" /> : null;
}
