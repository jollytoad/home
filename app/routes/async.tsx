import { Delayed } from "../components/Delayed.tsx";
import { Trickled } from "../components/Trickled.tsx";

export function AsyncStreamingExample() {
  return (
    <>
      <style>
        {`
        .red {
          color: red
        }
      `}
      </style>

      <p>This is a demo of streaming of asynchronous components.</p>

      <hr />

      <p>
        The following component returns an AsyncIterable of it's children,
        adding a 1 second delay before each child.
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
    </>
  );
}
