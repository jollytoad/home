import { Page } from "../../components/Page.tsx";
import { handlePage } from "../../lib/handle_page.tsx";
import { Evaluate, evaluatePropsFrom } from "./_components/Evaluate.tsx";

export default handlePage(({ req }) => {
  const evaluateProps = evaluatePropsFrom(req);

  return (
    <Page req={req} module={import.meta.url}>
      <link rel="stylesheet" href="/calc/calc.css" />

      <h1>Service Worker Calculator</h1>
      <form
        action="/calc"
        hx-boost="true"
        hx-get="/calc/eval"
        hx-target="#result"
      >
        <input
          name="expr"
          type="text"
          value={evaluateProps.expr}
          hx-get="/calc/eval"
          hx-trigger="keyup changed"
        />
        <Evaluate {...evaluateProps} />
        <hr />
        <button type="submit">Calculate</button>
      </form>
    </Page>
  );
});
