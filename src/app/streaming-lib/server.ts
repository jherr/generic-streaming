import type { StreamedResponse } from "./types";

const generateGUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString();
  });

const _streamingRequests: Record<
  string,
  {
    id: string;
    status: "pending" | "fulfilled" | "rejected";
    promise: Promise<unknown>;
    data: unknown | null;
  }[]
> = {};

function getCurrentStreamingState<T>(id: string) {
  if (!_streamingRequests[id]) {
    return {
      id,
      items: [],
      next: null,
    };
  }
  const items = _streamingRequests[id].map(({ id, data, status }) => ({
    id,
    status,
    data: data as T | null,
  }));
  return {
    id,
    items,
    next: items.map(({ data }) => data).includes(null) ? next : null,
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
    status: "pending",
    promise: item.promise
      .then((data) => {
        _streamingRequests[id][index].status = "fulfilled";
        _streamingRequests[id][index].data = data;
        return data;
      })
      .catch((e) => {
        _streamingRequests[id][index].status = "rejected";
      }) as Promise<T>,
    data: null,
  }));

  return getCurrentStreamingState(id);
}
