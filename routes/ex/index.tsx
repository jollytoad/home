import { Page } from "@/components/Page.tsx";
import { handlePage } from "@/lib/handle_page.ts";
import { Exchange, exchangePropsFrom } from "@/components/Exchange.tsx";

export default handlePage(({ req, match }) => {
  const exchangeProps = exchangePropsFrom(req, match);

  if (req?.headers.get("HX-Target")) {
    return <Exchange {...exchangeProps} />;
  } else {
    const { id, fromCurr, toCurr, amount } = exchangeProps;
    const swapUrl = `/ex/${toCurr}/${fromCurr}`;
    return (
      <Page>
        <h1>
          {fromCurr} to {toCurr} <a href={swapUrl} class="ex-swap">swap</a>
        </h1>
        <input
          name="amount"
          type="number"
          step="1.00"
          min="0.00"
          value={amount}
          hx-get={match.pathname.input}
          hx-trigger="change changed"
          hx-target={`#${id}`}
          hx-replace-url="true"
        />
        <p>
          <Exchange {...exchangeProps} />
        </p>
        <p>
          Conversion uses the current Mastercard exchange rate with zero bank
          fees.
        </p>
      </Page>
    );
  }
}, {
  Vary: "HX-Target",
});
