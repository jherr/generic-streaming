export type StreamedResponse<T> = {
  id: string;
  ids: string[];
  items: (T | null)[];
  next: ((id: string) => Promise<StreamedResponse<T>>) | null;
};
