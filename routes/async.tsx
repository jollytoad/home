import { Page } from "@/components/Page.tsx";
import { Delayed } from "@/components/Delayed.tsx";
import { Trickled } from "@/components/Trickled.tsx";
import { handlePage } from "@/lib/route.ts";

export default handlePage(({ req }) => (
  <Page req={req}>
    <p>This is a demo of streaming of asynchronous components.</p>

    <hr />

    <p>
      The following component returns an AsyncIterable of it's children, adding
      a 1 second delay before each child.
    </p>
    <ol>
      <Trickled delay={1000}>
        <li>one</li>
        <li>two</li>
        <li>three</li>
        <li>four</li>
      </Trickled>
    </ol>

    <Delayed delay={2000}>
      <div class="red">
        This component returns a Promise that delays for 2 seconds
      </div>
    </Delayed>

    <hr />

    <Delayed delay={3000}>
      <div class="red">
        This component returns a Promise that delays for 3 seconds
      </div>
    </Delayed>

    <hr />

    <Delayed delay={1000}>
      <div class="red">
        This component returns a Promise that delays for 1 second
      </div>
    </Delayed>
  </Page>
));
