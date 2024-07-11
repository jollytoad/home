// deno-lint-ignore-file no-explicit-any
const envCache = new WeakMap<WeakKey, Record<string, string>>();

export function cacheEnv(scope: WeakKey, env: Record<string, string>) {
  envCache.set(scope, env);
}

export function invalidateEnv(scope: WeakKey) {
  envCache.delete(scope);
}

export function hasEnv(name: string, scope?: WeakKey): boolean {
  return (scope && !!envCache.get(scope)?.[name]) ||
    globalThis.Deno?.env?.has(name) ||
    !!(globalThis as any).process?.env?.[name];
}

export function getEnv(name: string, scope?: WeakKey): string | undefined {
  return (scope && envCache.get(scope)?.[name]) ??
    globalThis.Deno?.env?.get(name) ?? (globalThis as any).process?.env?.[name];
}

export function setEnv(name: string, value: string, scope?: WeakKey) {
  const env = scope && envCache.get(scope);
  if (env) {
    env[name] = value;
  } else if (globalThis.Deno?.env) {
    globalThis.Deno.env.set(name, value);
  } else if ((globalThis as any).process?.env) {
    (globalThis as any).process.env[name] = value;
  }
}
