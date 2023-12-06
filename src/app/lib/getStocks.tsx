"use server";
import type { StockInfo } from "../types";
import StockWithCounter from "../components/StockWithCounter";

import type { StreamedResponse } from "../streaming-lib/types";
import { buildStreamedResponse } from "../streaming-lib/server";

export const getStocks = async (): Promise<StreamedResponse<StockInfo>> => {
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
      id: "ARPL",
      promise: generateFakeStock("ARPL", 1000),
    },
    {
      id: "GLOG",
      promise: generateFakeStock("GLOG", 6000),
    },
    {
      id: "MDFT",
      promise: generateFakeStock("MDFT", 3000),
    },
    {
      id: "AMZO",
      promise: generateFakeStock("AMZO", 2000),
    },
    {
      id: "FBL",
      promise: generateFakeStock("FBL", 5000),
    },
    {
      id: "TSLR",
      promise: generateFakeStock("TSLR", 1500),
    },
  ]);
};
