import { Page } from "@/components/Page.tsx";
import { handlePage } from "@/lib/route.ts";
import { getSearchValues } from "$http_fns/request.ts";
import { Evaluate } from "@/components/Evaluate.tsx";

export default handlePage(({ req }) => {
  const expr = getSearchValues(req)("expr")[0] ?? "";

  return (
    <Page req={req}>
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
          value={expr}
          hx-get="/calc/eval"
          hx-trigger="keyup changed"
        />
        <Evaluate expr={expr} />
        <hr />
        <button type="submit">Calculate</button>
      </form>
    </Page>
  );
});
