import type { StreamedResponse } from "./streaming-types";

const generateGUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString();
  });

const _streamingRequests: Record<
  string,
  {
    id: string;
    promise: Promise<unknown>;
    data: unknown | null;
  }[]
> = {};

function getCurrentStreamingState<T>(id: string) {
  if (!_streamingRequests[id]) {
    return {
      id,
      ids: [],
      items: [],
      next: null,
    };
  }
  const items = _streamingRequests[id].map((item) => item.data as T | null);
  return {
    id,
    ids: _streamingRequests[id].map((item) => item.id),
    items,
    next: items.includes(null) ? next : null,
  };
}

async function next<T>(id: string): Promise<StreamedResponse<T>> {
  "use server";
  return getCurrentStreamingState(id);
}

export async function buildStreamedResponse<T>(
  items: {
    id: string;
    promise: Promise<T>;
  }[]
): Promise<StreamedResponse<T>> {
  const id = generateGUID();

  _streamingRequests[id] = items.map((item, index) => ({
    id: item.id,
    promise: item.promise.then((data) => {
      _streamingRequests[id][index].data = data;
      return data;
    }) as Promise<T>,
    data: null,
  }));

  return getCurrentStreamingState(id);
}
