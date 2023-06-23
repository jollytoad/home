import { cascade } from "$http_fns/cascade.ts";
import { byPattern } from "$http_fns/pattern.ts";
import { byMethod } from "$http_fns/method.ts";
import { badRequest, notFound } from "$http_fns/response.ts";
import { signIn } from "$deno_kv_oauth/sign_in.ts";
import { signOut } from "$deno_kv_oauth/sign_out.ts";
import { handleCallback as handleCallback_ } from "$deno_kv_oauth/handle_callback.ts";
import {
  getOAuth2ClientFn,
  getOAuth2ClientScope,
} from "@/lib/oauth2_clients.ts";

export default cascade(
  byPattern("/signin/:provider", byMethod({ GET: handleSignIn })),
  byPattern("/callback/:provider", byMethod({ GET: handleCallback })),
  byPattern("/signout", byMethod({ GET: handleSignOut })),
);

type OAuth2Client = Parameters<typeof signIn>[1];

async function getOAuth2Client(
  req: Request,
  provider: string | undefined,
): Promise<OAuth2Client> {
  if (!provider) {
    throw badRequest();
  }

  const createOAuth2Client = getOAuth2ClientFn(provider);

  if (!createOAuth2Client) {
    throw notFound();
  }

  const url = new URL(req.url);

  return createOAuth2Client({
    redirectUri: `${url.origin}/callback/${provider}`,
    defaults: {
      scope: await getOAuth2ClientScope(provider),
    },
  });
}

export async function handleSignIn(
  req: Request,
  match: URLPatternResult,
): Promise<Response> {
  return signIn(
    req,
    await getOAuth2Client(req, match.pathname.groups.provider),
  );
}

export async function handleCallback(
  req: Request,
  match: URLPatternResult,
): Promise<Response> {
  const { response } = await handleCallback_(
    req,
    await getOAuth2Client(req, match.pathname.groups.provider),
  );
  return response;
}

export function handleSignOut(req: Request): Promise<Response> {
  return signOut(req);
}
