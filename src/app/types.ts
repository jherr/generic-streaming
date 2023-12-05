export type StockInfo = {
  name: string;
  price: number;
  ui: JSX.Element;
};

export type StreamedResponse<T> = {
  id: string;
  items: (T | null)[];
  next: ((id: string) => Promise<StreamedResponse<T>>) | null;
};
