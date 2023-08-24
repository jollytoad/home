import * as providers from "$deno_kv_oauth/providers.ts";
import type { signIn } from "$deno_kv_oauth/sign_in.ts";

export type OAuth2Client = Parameters<typeof signIn>[1];

type Providers = typeof providers;
type ProviderFn = Providers[keyof Providers];
type CreateClientFn = (
  config: Parameters<ProviderFn>[0],
) => ReturnType<ProviderFn>;

/**
 * Get a list of all supported OAuth2 client names
 */
export function getOAuth2ClientNames(): string[] {
  const names: string[] = [];

  for (const [name, fn] of Object.entries(providers)) {
    if (typeof fn === "function") {
      const m = /^create(.*)OAuth2Client$/.exec(name);
      if (m && m[1]) {
        names.push(m[1]);
      }
    }
  }

  return names;
}

/**
 * Detect whether environment vars have been set for a given OAuth2 client
 */
export async function hasOAuth2ClientEnvVars(name: string): Promise<boolean> {
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
 * Get the create client function for an OAuth2 client
 * @param provider the name of the OAuth2 client
 * @returns the OAuth2 client constructor function
 */
export function getOAuth2ClientFn(
  provider: string,
): CreateClientFn | undefined {
  const providerFnName = `create${provider.toLowerCase()}oauth2client`;

  for (const [name, fn] of Object.entries(providers)) {
    if (typeof fn === "function") {
      if (name.toLowerCase() === providerFnName) {
        return fn as CreateClientFn;
      }
    }
  }
}

/**
 * Get the OAuth2 scope for a provider from environment vars
 * @param provider the name of the OAuth2 client
 */
export async function getOAuth2ClientScope(
  provider: string,
): Promise<undefined | string> {
  const clientScopeVar = `${provider.toUpperCase()}_CLIENT_SCOPE`;
  if (
    await Deno.permissions.query({ name: "env", variable: clientScopeVar })
  ) {
    return Deno.env.get(clientScopeVar);
  }
}
