import { getSearchValues } from "@http/request/search-values";

interface Props {
  id: string;
  fromCurr: string;
  toCurr: string;
  amount?: number;
}

interface ConversionData {
  date: string;
  data: {
    conversionRate: number;
    crdhldBillAmt: number;
    fxDate: string;
    transCurr: string;
    crdhldBillCurr: string;
    transAmt: number;
  };
}

export async function Exchange({ id, amount, fromCurr, toCurr }: Props) {
  if (Number.isFinite(amount)) {
    console.log("Converting...", amount);

    try {
      const response = await fetch(
        `https://www.mastercard.co.uk/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=${fromCurr}&crdhldBillCurr=${toCurr}&bankFee=0&transAmt=${amount}`,
      );

      if (response.ok) {
        const result = await response.json() as ConversionData;

        console.log("Result...", result);

        const { data: { crdhldBillAmt, transCurr, crdhldBillCurr, transAmt } } =
          result;

        return (
          <span id={id} class="result">
            {transAmt.toFixed(2)} {transCurr} = {crdhldBillAmt?.toFixed(2)}{" "}
            {crdhldBillCurr}
          </span>
        );
      }
    } catch (e) {
      console.error(e);
    }

    return <span id={id} class="error">Conversion failed!</span>;
  } else {
    return <span id={id} class="blank"></span>;
  }
}

export function exchangePropsFrom(
  req?: Request,
  match?: URLPatternResult,
  id = "result",
): Props {
  return {
    id: req && req.headers.get("HX-Target") || id,
    fromCurr: match?.pathname.groups.from?.toUpperCase() || "EUR",
    toCurr: match?.pathname.groups.to?.toUpperCase() || "GBP",
    amount: req && Number.parseFloat(getSearchValues(req, "amount")[0] || ""),
  };
}
