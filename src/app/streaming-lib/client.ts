"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type { StreamedResponse, StreamedResponseItem } from "./types";

export function useStreamingResponse<T>(
  action: () => Promise<StreamedResponse<T>>
): {
  items: StreamedResponseItem<T>[];
  refetch: () => void;
} {
  const [items, setItems] = useState<StreamedResponseItem<T>[]>([]);

  const id = useRef<string | null>(null);
  const pending = useRef(false);

  const refetch = useCallback(() => {
    if (!pending.current) {
      const getNext = (resp: StreamedResponse<T>) => {
        id.current = resp.id;
        setItems(resp.items);
        if (resp.next) {
          resp.next(id.current).then(getNext);
        } else {
          pending.current = false;
        }
      };
      setItems([]);
      pending.current = true;
      action().then(getNext);
    }
  }, [action]);

  useEffect(refetch, [refetch]);

  return { items, refetch };
}
