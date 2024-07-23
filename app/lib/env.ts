// deno-lint-ignore-file no-explicit-any
const envCache = new WeakMap<WeakKey, Record<string, unknown>>();

export function cacheEnv<E extends Record<string, unknown>>(
  scope: WeakKey,
  env: E,
) {
  if (env && typeof env === "object") {
    envCache.set(scope, env);
  }
}

export function invalidateEnv(scope: WeakKey) {
  envCache.delete(scope);
}

export function hasEnv(name: string, scope?: WeakKey): boolean {
  return (scope && !!envCache.get(scope)?.[name]) ||
    globalThis.Deno?.env?.has(name) ||
    !!(globalThis as any).process?.env?.[name];
}

export function getEnv<T = string>(
  name: string,
  scope?: WeakKey,
): T | undefined {
  return (scope && envCache.get(scope)?.[name]) ??
    globalThis.Deno?.env?.get(name) ?? (globalThis as any).process?.env?.[name];
}

export function setEnv<T = string>(name: string, value: T, scope?: WeakKey) {
  const env = scope && envCache.get(scope);
  if (env) {
    env[name] = value;
  } else if (globalThis.Deno?.env) {
    globalThis.Deno.env.set(name, `${value}`);
  } else if ((globalThis as any).process?.env) {
    (globalThis as any).process.env[name] = value;
  }
}

export function envInterceptor() {
  return {
    request: cacheEnv,
    finally: invalidateEnv,
  };
}
