"use client";
import { useStreamingResponse } from "../streaming-lib/client";
import type { StreamedResponse } from "../streaming-lib/types";

import type { StockInfo } from "../types";

export default function Dashboard({
  getStocks,
}: {
  getStocks: () => Promise<StreamedResponse<StockInfo>>;
}) {
  const { items: stocks, refetch } = useStreamingResponse(getStocks);

  return (
    <>
      <button
        onClick={refetch}
        className="bg-blue-500 text-white rounded-full px-4 py-2 text-2xl font-bold"
      >
        Refetch
      </button>
      <div className="grid grid-cols-3 gap-4 mt-5">
        {stocks.map(({ id, data }) => (
          <div key={id}>
            <div className="font-bold text-3xl">{id}</div>
            {data?.ui ? <div>{data.ui}</div> : <div>Loading...</div>}
          </div>
        ))}
      </div>
    </>
  );
}
