"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type { StreamedResponse } from "./streaming-types";

export function useStreamingResponse<T>(
  action: () => Promise<StreamedResponse<T>>
): {
  items: (T | null)[];
  ids: string[];
  refetch: () => void;
} {
  const [items, setItems] = useState<(T | null)[]>([]);
  const [ids, setIDs] = useState<string[]>([]);

  const id = useRef<string | null>(null);
  const pending = useRef(false);
  const refetch = useCallback(() => {
    if (!pending.current) {
      const getNext = (resp: StreamedResponse<T>) => {
        id.current = resp.id;
        setItems(resp.items);
        setIDs(resp.ids);
        if (resp.next) {
          resp.next(id.current).then(getNext);
        } else {
          pending.current = false;
        }
      };
      setItems([]);
      setIDs([]);
      pending.current = true;
      action().then(getNext);
    }
  }, [action]);

  useEffect(refetch, [refetch]);

  return { items, ids, refetch };
}
