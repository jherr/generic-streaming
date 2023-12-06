This is an experiment in sending a stream of components and data back from a NextJS App Router application using a server action that supports a psuedo-streaming methodology.

The Vercel AI library has a fascinating feature that allows you to [send back a stream of components and data from a server action](https://sdk.vercel.ai/docs/api-reference/streaming-react-response). It's a really great feature, but it's hard wound around using an AI to drive the stream. I wanted to see if I could create a library that would allow you to send back a stream of components and data without having to use any AI service integration (or any particular service integration at all).

## Proof Of Concept

The idea is simple, we have a set of stock values that we want to show as soon as we have the data. Some requests take longer than others and we want to display the results as soon as we have them. We also want the server to handle returning the appropriate component for rendering.

This video shows the proof of concept in action:

![Proof of Concept](./images/demo.gif)

Each of the stocks has a different amount of lag in getting data from the service, but we want to get all the stocks and get each as soon as it's available. In the example the `getStocks` server action simulates the lag by using `setTimeout` to delay the response for each of the simulated stocks. And then uses the generic `buildStreamedResponse` function to build the streaming response that will go to the client.

The `Dashboard` component then uses the `useStreamingResponse` hook to handle the streaming response and render the components as they come in.

## Using The API

In a server action you can use the `buildStreamedResponse` function to take a set of ID'ed promises as an array and stream them to the client:

```ts
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
    ...
  ]);
};
```

You can have whatever promises you want in the array. You can have mutiple of the same type of promise, or any combination of promises. The only requirement is that each promise has an ID that is unique within the array.

Then on the client you can use the `useStreamingResponse` hook to handle the streaming response:

```tsx
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
```

For each item in the array we get `id`, `status` and `data`. ID is a unique string. `status` is the status of the promise (pending, fulfilled, rejected). And `data` is the data returned from the promise. In this case we have a `ui` property on the data that holds the component to render. But you can have whatever data you want in the `data` property. You can have a combination of data and components. Or no data and just a component. Or multiple components. Whatever you want.

## Advantages Over The Vercel/AI Approach

- This approach is disconnected from AI. You can put whatever kind of requests you want into the array of requests. In this case we send back an object with the name of the stock, the price, and then a `ui` property that holds the rendered component.
- You can send back a combination of data and UI components, not just UI.

## Important Files

- `lib/getStocks.tsx` - The server action that returns the stream of components and data.
- `components/Dashboard.tsx` - The component that renders the stream of components and data.
- `components/StockWithCounter.tsx` - The component that renders the stock data and has a counter to demonstrate that the component is rendered on the client.
- `streaming-lib/client.ts` - Holds the `useStreamingResponse` custom hook that handles the streaming response.
- `streaming-lib/server.ts` - Holds the `buildStreamedResponse` that takes the array of promises with IDs and then manages the streaming with the client hook.
- `streaming-lib/types.ts` - Holds the types for the streaming library.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
