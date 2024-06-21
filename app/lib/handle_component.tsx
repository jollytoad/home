import type { ComponentType } from "@http/jsx-stream";
import type { RouteProps } from "./types.ts";
import { handlePage } from "./handle_page.ts";
import { Page } from "../components/Page.tsx";

export function handleComponent(
  Component: ComponentType<RouteProps>,
  module?: string | URL,
) {
  return handlePage((props: RouteProps) => (
    <Page req={props.req} module={module}>
      <Component {...props} />
    </Page>
  ));
}
