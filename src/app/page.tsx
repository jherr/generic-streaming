import { getStocks } from "./lib/getStocks";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl pt-5">
      <Dashboard getStocks={getStocks} />
    </main>
  );
}
