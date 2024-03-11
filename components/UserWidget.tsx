import type { RequestProps } from "../lib/route.ts";
import { getSessionId } from "$deno_kv_oauth/get_session_id.ts";
import {
  getOAuthClientNames,
  hasOAuthClientEnvVars,
} from "../lib/oauth_config.ts";

export async function UserWidget(
  { req, lazy }: Partial<RequestProps> & { lazy?: boolean },
) {
  if (lazy) {
    return (
      <div
        class="user-widget"
        hx-get="/auth/widget"
        hx-trigger="load"
        hx-swap="outerHTML"
      >
      </div>
    );
  }

  if (!req) {
    return null;
  }

  const sessionId = await getSessionId(req);

  if (sessionId) {
    return <SignedIn sessionId={sessionId} />;
  } else {
    const providers = await getProviders();
    return <SignedOut providers={providers} />;
  }
}

function SignedIn({ sessionId }: { sessionId: string }) {
  return (
    <div class="user-widget signed-in">
      <a href="/auth/signout" title={sessionId}>Sign Out</a>
    </div>
  );
}

function SignedOut({ providers }: { providers: Provider[] }) {
  switch (providers.length) {
    case 0:
      return null;
    case 1:
      return (
        <div class="user-widget signed-out">
          <a
            href={`/auth/${providers[0].id}/signin`}
            title={`Sign in with ${providers[0].name}`}
          >
            Sign In
          </a>
        </div>
      );
    default:
      return (
        <div class="user-widget signed-out">
          <span class="signin-header">Sign In with...</span>
          <span class="signin-menu">
            {providers.map((provider) => (
              <a
                href={`/auth/${provider.id}/signin`}
                title={`Sign in with ${provider.name}`}
              >
                {provider.name}
              </a>
            ))}
          </span>
        </div>
      );
  }
}

interface Provider {
  id: string;
  name: string;
}

async function getProviders(): Promise<Provider[]> {
  return (await Promise.all(
    getOAuthClientNames().map(async (name) => {
      if (await hasOAuthClientEnvVars(name)) {
        return {
          id: name.toLowerCase(),
          name,
        };
      }
    }),
  )).filter((v): v is Provider => !!v);
}
