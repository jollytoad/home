import type { RequestProps } from "@/lib/route.ts";
import { getSessionId } from "$deno_kv_oauth/get_session_id.ts";
import {
  getOAuth2ClientNames,
  hasOAuth2ClientEnvVars,
} from "@/lib/oauth2_clients.ts";

export async function UserWidget({ req }: RequestProps) {
  const sessionId = await getSessionId(req);

  if (sessionId) {
    return <SignedIn sessionId={sessionId} />;
  } else {
    return <SignedOut />;
  }
}

function SignedIn({ sessionId }: { sessionId: string }) {
  return (
    <div class="user-widget signed-in">
      <a href="/signout" title={sessionId}>Sign Out</a>
    </div>
  );
}

function SignedOut() {
  const providers = getProviders();
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
          <span>Sign In with...</span>
          {providers.map((provider) => (
            <a
              href={`/signin/${provider.id}`}
              title={`Sign in with ${provider.name}`}
            >
              {provider.name}
            </a>
          ))}
        </div>
      );
  }
}

interface Provider {
  id: string;
  name: string;
}

function getProviders(): Provider[] {
  return getOAuth2ClientNames().filter(hasOAuth2ClientEnvVars).map((name) => ({
    id: name.toLowerCase(),
    name,
  }));
}
