"use client";
import { useStreamingResponse } from "./streaming-client";
import type { StockInfo, StreamedResponse } from "./types";

export default function Dashboard({
  getStocks,
}: {
  getStocks: () => Promise<StreamedResponse<StockInfo>>;
}) {
  const stocks = useStreamingResponse(getStocks);

  return (
    <div className="grid grid-cols-3 gap-4">
      {stocks.map((stock, index) =>
        stock ? (
          <div key={stock.name}>
            <div className="font-bold text-3xl">{stock.name}</div>
            <div>{stock.ui}</div>
          </div>
        ) : (
          <div key={index}>Pending</div>
        )
      )}
    </div>
  );
}
