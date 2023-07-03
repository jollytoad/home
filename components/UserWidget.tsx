import type { RequestProps } from "@/lib/route.ts";
import { getSessionId } from "$deno_kv_oauth/get_session_id.ts";
import {
  getOAuth2ClientNames,
  hasOAuth2ClientEnvVars,
} from "@/lib/oauth2_clients.ts";
import { getTokensBySession } from "$deno_kv_oauth/core.ts";

export async function UserWidget({ req }: RequestProps) {
  const sessionId = await getSessionId(req);

  if (sessionId) {
    const tokens = await getTokensBySession(sessionId);
    console.log(tokens?.idToken);
    return <SignedIn sessionId={sessionId} />;
  } else {
    const providers = await getProviders();
    return <SignedOut providers={providers} />;
  }
}

function SignedIn({ sessionId }: { sessionId: string }) {
  return (
    <div class="user-widget signed-in">
      <a href="/signout" title={sessionId}>Sign Out</a>
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
            href={`/signin/${providers[0].id}`}
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
                href={`/signin/${provider.id}`}
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
    getOAuth2ClientNames().map(async (name) => {
      if (await hasOAuth2ClientEnvVars(name)) {
        return {
          id: name.toLowerCase(),
          name,
        };
      }
    }),
  )).filter((v): v is Provider => !!v);
}
