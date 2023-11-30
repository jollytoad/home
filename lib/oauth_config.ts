import * as providers from "./oauth_providers.ts";
export type { OAuth2ClientConfig } from "$deno_kv_oauth/types.ts";

type Providers = typeof providers;
type ProviderFn = Providers[keyof Providers];
type CreateClientFn = (
  config: Parameters<ProviderFn>[0],
) => ReturnType<ProviderFn>;

/**
 * Get a list of all supported OAuth client names
 */
export function getOAuthClientNames(): string[] {
  const names: string[] = [];

  for (const [name, fn] of Object.entries(providers)) {
    if (typeof fn === "function") {
      const m = /^create(.*)OAuthConfig$/.exec(name);
      if (m && m[1]) {
        names.push(m[1]);
      }
    }
  }

  return names;
}

/**
 * Detect whether environment vars have been set for a given OAuth client
 */
export async function hasOAuthClientEnvVars(name: string): Promise<boolean> {
  const upper = name.toUpperCase();
  const clientIdVar = `${upper}_CLIENT_ID`;
  const clientSecretVar = `${upper}_CLIENT_SECRET`;
  if (
    await Deno.permissions.query({ name: "env", variable: clientIdVar }) &&
    await Deno.permissions.query({ name: "env", variable: clientSecretVar })
  ) {
    return Deno.env.has(clientIdVar) && Deno.env.has(clientSecretVar);
  } else {
    return false;
  }
}

/**
 * Get the create config function for an OAuth client
 * @param provider the name of the OAuth client
 * @returns the OAuth config constructor function
 */
export function getOAuthConfigFn(
  provider: string,
): CreateClientFn | undefined {
  const providerFnName = `create${provider.toLowerCase()}oauthconfig`;

  for (const [name, fn] of Object.entries(providers)) {
    if (typeof fn === "function") {
      if (name.toLowerCase() === providerFnName) {
        return fn as CreateClientFn;
      }
    }
  }
}

/**
 * Get the OAuth scope for a provider from environment vars
 * @param provider the name of the OAuth client
 */
export async function getOAuthClientScope(
  provider: string,
): Promise<undefined | string> {
  const clientScopeVar = `${provider.toUpperCase()}_CLIENT_SCOPE`;
  if (
    await Deno.permissions.query({ name: "env", variable: clientScopeVar })
  ) {
    return Deno.env.get(clientScopeVar);
  }
}
