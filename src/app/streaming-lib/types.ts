export type StreamedResponseItem<T> = {
  id: string;
  status: "pending" | "fulfilled" | "rejected";
  data: T | null;
};

export type StreamedResponse<T> = {
  id: string;
  items: StreamedResponseItem<T>[];
  next: ((id: string) => Promise<StreamedResponse<T>>) | null;
};
