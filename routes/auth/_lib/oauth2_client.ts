import { badRequest } from "$http_fns/response/bad_request.ts";
import { notFound } from "$http_fns/response/not_found.ts";
import {
  getOAuth2ClientFn,
  getOAuth2ClientScope,
  type OAuth2Client,
} from "@/lib/oauth2_clients.ts";

export async function asOAuth2Client(
  req: Request,
  match: URLPatternResult,
): Promise<OAuth2Client> {
  const provider = match.pathname.groups.provider;

  if (!provider) {
    throw badRequest();
  }

  const createOAuth2Client = getOAuth2ClientFn(provider);

  if (!createOAuth2Client) {
    throw notFound();
  }

  const redirectUri = new URL("callback", req.url).href;
  const scope = await getOAuth2ClientScope(provider);

  return createOAuth2Client({
    redirectUri,
    defaults: {
      scope,
    },
  });
}
