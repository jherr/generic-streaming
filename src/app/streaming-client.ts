"use client";
import { useEffect, useRef, useState } from "react";
import type { StreamedResponse } from "./types";

export function useStreamingResponse<T>(
  action: () => Promise<StreamedResponse<T>>
) {
  const [items, setItems] = useState<(T | null)[]>([]);

  const id = useRef<string | null>(null);
  useEffect(() => {
    const getNext = (resp: StreamedResponse<T>) => {
      id.current = resp.id;
      setItems(resp.items);
      if (resp.next) {
        resp.next(id.current).then(getNext);
      }
    };
    action().then(getNext);
  }, [action]);
  return items;
}
