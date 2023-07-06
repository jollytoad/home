import { Page } from "@/components/Page.tsx";
import { handlePage, RouteProps } from "@/lib/route.ts";

export default handlePage(HomePage);

export function HomePage({ req }: RouteProps) {
  return (
    <Page req={req}>
      <h1>Web Components</h1>

      <p>Demo of using web components from various libraries.</p>
      <p>JS is injected as each component is first encountered.</p>

      <h2>Material Design</h2>

      <md-tabs>
        <md-tab>Tab 1</md-tab>
        <md-tab>Tab 2</md-tab>
        <md-tab>Tab 3</md-tab>
      </md-tabs>

      <h2>Shoelace</h2>

      <sl-tab-group>
        <sl-tab slot="nav" panel="panel-1">Tab 1</sl-tab>
        <sl-tab slot="nav" panel="panel-2">Tab 2</sl-tab>
        <sl-tab slot="nav" panel="panel-3">Tab 3</sl-tab>

        <sl-tab-panel name="panel-1">Panel 1</sl-tab-panel>
        <sl-tab-panel name="panel-2">Panel 2</sl-tab-panel>
        <sl-tab-panel name="panel-3">Panel 3</sl-tab-panel>
      </sl-tab-group>
    </Page>
  );
}
