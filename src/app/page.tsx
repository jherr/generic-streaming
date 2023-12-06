import type { StockInfo } from "./types";
import StockWithCounter from "./StockWithCounter";

import type { StreamedResponse } from "./streaming-types";
import { buildStreamedResponse } from "./streaming-server";

import Dashboard from "./Dashboard";

const getStocks = async (): Promise<StreamedResponse<StockInfo>> => {
  "use server";

  async function generateFakeStock(
    name: string,
    delay: number
  ): Promise<StockInfo> {
    await new Promise((resolve) => setTimeout(resolve, delay));
    const price = Math.random() * 1000;
    return {
      name,
      price,
      ui: <StockWithCounter name={name} price={price} />,
    };
  }

  return buildStreamedResponse([
    {
      id: "AAPL",
      promise: generateFakeStock("AAPL", 1000),
    },
    {
      id: "GOOG",
      promise: generateFakeStock("GOOG", 6000),
    },
    {
      id: "MSFT",
      promise: generateFakeStock("MSFT", 3000),
    },
    {
      id: "AMZN",
      promise: generateFakeStock("AMZN", 2000),
    },
    {
      id: "FB",
      promise: generateFakeStock("FB", 5000),
    },
    {
      id: "TSLA",
      promise: generateFakeStock("TSLA", 1500),
    },
  ]);
};

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl pt-5">
      <Dashboard getStocks={getStocks} />
    </main>
  );
}
