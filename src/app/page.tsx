import MantraTextView from "../component/mantra-text-view";
import {
  SHURANGAMA_MANTRA_PAGE_1,
  SHURANGAMA_MANTRA_PAGE_12,
} from "../data/shurangama-mantra";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center font-sans dark:bg-black">
      <MantraTextView mantra={SHURANGAMA_MANTRA_PAGE_12} />
    </div>
  );
}
