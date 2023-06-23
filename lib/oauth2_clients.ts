import * as providers from "$deno_kv_oauth/providers.ts";

type Providers = typeof providers;
type ProviderFn = Providers[keyof Providers];
type CreateClientFn = (
  config: Parameters<ProviderFn>[0],
) => ReturnType<ProviderFn>;

export function getOAuth2ClientFn(
  provider: string,
): CreateClientFn | undefined {
  const providerFnName = `create${provider}oauth2client`;

  for (const [name, fn] of Object.entries(providers)) {
    if (typeof fn === "function") {
      if (name.toLowerCase() === providerFnName) {
        return fn as CreateClientFn;
      }
    }
  }
}

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
