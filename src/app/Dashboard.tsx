"use client";
import { useStreamingResponse } from "./streaming-client";
import type { StreamedResponse } from "./streaming-types";

import type { StockInfo } from "./types";

export default function Dashboard({
  getStocks,
}: {
  getStocks: () => Promise<StreamedResponse<StockInfo>>;
}) {
  const { items: stocks, ids, refetch } = useStreamingResponse(getStocks);

  return (
    <>
      <button
        onClick={refetch}
        className="bg-blue-500 text-white rounded-full px-4 py-2 mb-2 text-2xl font-bold"
      >
        Refetch
      </button>
      <div className="grid grid-cols-3 gap-4">
        {stocks.map((stock, index) => (
          <div key={ids[index]}>
            <div className="font-bold text-3xl">{ids[index]}</div>
            {stock?.ui ? <div>{stock.ui}</div> : <div>Loadng...</div>}
          </div>
        ))}
      </div>
    </>
  );
}
