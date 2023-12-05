import type { StockInfo, StreamedResponse } from "./types";
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
      ui: (
        <div className="flex flex-col items-center justify-center p-4 m-4 bg-white rounded-lg shadow-lg dark:bg-zinc-800">
          <div className="text-xl italic">{name}</div>
          <div className="text-2xl font-bold">${price.toFixed(2)}</div>
        </div>
      ),
    };
  }

  return buildStreamedResponse([
    generateFakeStock("AAPL", 1000),
    generateFakeStock("GOOG", 2000),
    generateFakeStock("MSFT", 3000),
    generateFakeStock("AMZN", 4000),
    generateFakeStock("FB", 5000),
    generateFakeStock("TSLA", 6000),
  ]);
};

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl pt-5">
      <Dashboard getStocks={getStocks} />
    </main>
  );
}
