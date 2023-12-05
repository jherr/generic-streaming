import type { StreamedResponse } from "./types";

const generateGUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString();
  });

const _streamingRequests: Record<
  string,
  {
    promise: Promise<unknown>;
    data: unknown | null;
  }[]
> = {};

async function next<T>(id: string): Promise<StreamedResponse<T>> {
  "use server";
  const items = _streamingRequests[id].map((item) => item.data);
  return {
    id,
    items: items as T[],
    next: items.includes(null) ? next : null,
  };
}

export async function buildStreamedResponse<T>(
  items: Promise<T>[]
): Promise<StreamedResponse<T>> {
  const id = generateGUID();
  _streamingRequests[id] = items.map((promise, index) => ({
    promise: promise.then((data) => {
      _streamingRequests[id][index].data = data;
      return data;
    }) as Promise<T>,
    data: null,
  }));
  return {
    id,
    items: _streamingRequests[id].map((item) => item.data) as (T | null)[],
    next,
  };
}
