export function TabsExample() {
  return (
    <>
      <h1>Web Components</h1>

      <p>Demo of using web components from various libraries.</p>
      <p>JS is injected as each component is first encountered.</p>

      <h2>
        <a
          href="https://github.com/material-components/material-web"
          target="_blank"
        >
          Material Design
        </a>
      </h2>

      <md-tabs>
        <md-tab>Tab 1</md-tab>
        <md-tab>Tab 2</md-tab>
        <md-tab>Tab 3</md-tab>
      </md-tabs>

      <h2>
        <a href="https://shoelace.style" target="_blank">Shoelace</a>
      </h2>

      <sl-tab-group>
        <sl-tab slot="nav" panel="panel-1">Tab 1</sl-tab>
        <sl-tab slot="nav" panel="panel-2">Tab 2</sl-tab>
        <sl-tab slot="nav" panel="panel-3">Tab 3</sl-tab>

        <sl-tab-panel name="panel-1">Panel 1</sl-tab-panel>
        <sl-tab-panel name="panel-2">Panel 2</sl-tab-panel>
        <sl-tab-panel name="panel-3">Panel 3</sl-tab-panel>
      </sl-tab-group>

      <h2>
        <a href="https://patternflyelements.org">PatternFly</a>
      </h2>

      <pf-tabs>
        <pf-tab slot="tab">Tab 1</pf-tab>
        <pf-tab-panel>Panel 1</pf-tab-panel>
        <pf-tab slot="tab">Tab 2</pf-tab>
        <pf-tab-panel>Panel 2</pf-tab-panel>
        <pf-tab slot="tab">Tab 3</pf-tab>
        <pf-tab-panel>Panel 3</pf-tab-panel>
      </pf-tabs>

      <h2>
        <a href="https://github.com/github/github-elements">GitHub Elements</a>
      </h2>

      <p>
        NOTE: The styling is provided by{" "}
        <a href="https://missing.style">missing.css</a>
      </p>

      <tab-container>
        <div role="tablist">
          <button type="button" id="tab-one" role="tab" aria-selected="true">
            Tab 1
          </button>
          <button type="button" id="tab-two" role="tab" tabindex="-1">
            Tab 2
          </button>
          <button type="button" id="tab-three" role="tab" tabindex="-1">
            Tab 3
          </button>
        </div>
        <div role="tabpanel" aria-labelledby="tab-one">
          Panel 1
        </div>
        <div role="tabpanel" aria-labelledby="tab-two" hidden>
          Panel 2
        </div>
        <div role="tabpanel" aria-labelledby="tab-three" hidden>
          Panel 3
        </div>
      </tab-container>

      <h2>
        <a href="https://wiredjs.com">Wired Elements</a>
      </h2>

      <p>Doesn't seem to render the tab bar correctly!</p>

      <wired-tabs selected="tab-2">
        <wired-tab name="tab-1">
          <h4>Tab 1</h4>
          <p>Panel 1</p>
        </wired-tab>
        <wired-tab name="tab-2">
          <h4>Tab 2</h4>
          <p>Panel 2</p>
        </wired-tab>
        <wired-tab name="tab-3">
          <h4>Tab 3</h4>
          <p>Panel 3</p>
        </wired-tab>
      </wired-tabs>

      <h2>
        <a href="https://github.com/vaadin/web-components">Vaadin</a>
      </h2>

      <p>
        Can't get this to work in the browser, doesn't appear to be any official
        browser ESM modules.
      </p>

      <vaadin-tabs>
        <vaadin-tab>Tab 1</vaadin-tab>
        <vaadin-tab>Tab 2</vaadin-tab>
        <vaadin-tab>Tab 3</vaadin-tab>
      </vaadin-tabs>
    </>
  );
}
