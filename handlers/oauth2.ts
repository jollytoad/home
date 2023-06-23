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

function getOAuth2Client(
  req: Request,
  provider: string | undefined,
): OAuth2Client {
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
      scope: getOAuth2ClientScope(provider),
    },
  });
}

export function handleSignIn(
  req: Request,
  match: URLPatternResult,
): Promise<Response> {
  return signIn(req, getOAuth2Client(req, match.pathname.groups.provider));
}

export async function handleCallback(
  req: Request,
  match: URLPatternResult,
): Promise<Response> {
  const { response } = await handleCallback_(
    req,
    getOAuth2Client(req, match.pathname.groups.provider),
  );
  return response;
}

export function handleSignOut(req: Request): Promise<Response> {
  return signOut(req);
}
