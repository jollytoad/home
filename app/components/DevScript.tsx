import { getEnv } from "../lib/env.ts";

export interface DevScriptProps {
  req: Request;
  src: string;
  envVar?: string;
  params?: Record<string, string | undefined>;
}

export function DevScript(
  { req, src, envVar, params }: DevScriptProps,
) {
  const enable = envVar && getEnv(envVar, req) === "true";

  if (params) {
    const url = new URL(src, "dummy:/");
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) {
        url.searchParams.set(key, val);
      }
    });
    src = url.protocol === "dummy:"
      ? `${url.pathname}${url.search}${url.hash}`
      : url.href;
  }

  return enable ? <script src={src} type="module" /> : null;
}
