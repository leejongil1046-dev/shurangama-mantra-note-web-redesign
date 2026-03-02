"use client";

import { useState } from "react";
import MantraTextView from "../component/mantra-text-view";
import { SHURANGAMA_MANTRA_PAGES } from "../data/shurangama-mantra";
import { createBlankIndices } from "@/lib/blanks";
import { usePagination } from "@/hooks/use-pagination";

type BlankByPage = Record<number, Set<number>>;

export default function Home() {
  const [showBlanks, setShowBlanks] = useState(false);
  const [blankByPage, setBlankByPage] = useState<BlankByPage>({});

  const {
    currentIndex,
    currentItem: currentPage,
    total,
    isFirst,
    isLast,
    goPrev,
    goNext,
  } = usePagination({
    items: SHURANGAMA_MANTRA_PAGES,
  });

  const currentBlankIndices = blankByPage[currentIndex] ?? new Set<number>();

  const handleToggleBlanks = () => {
    const nextChecked = !showBlanks;

    if (nextChecked && Object.keys(blankByPage).length === 0) {
      const nextBlankByPage: BlankByPage = {};

      SHURANGAMA_MANTRA_PAGES.forEach((page, index) => {
        nextBlankByPage[index] = createBlankIndices(page);
      });

      setBlankByPage(nextBlankByPage);
    }

    setShowBlanks(nextChecked);
  };

  if (!currentPage) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="grid h-screen w-screen grid-cols-[120px_1fr_120px]">
        <div className="flex items-center justify-center">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="rounded border px-4 py-2 disabled:opacity-40"
          >
            이전
          </button>
        </div>

        <div className="flex w-full flex-col items-center pt-6">
          <div className="mb-4 flex w-full items-center justify-center">
            <button
              type="button"
              onClick={handleToggleBlanks}
              className="flex items-center gap-3"
              aria-pressed={showBlanks}
            >
              <span className="text-lg font-medium">빈칸</span>

              <span
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  showBlanks ? "bg-gray-800" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    showBlanks ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </span>
            </button>
          </div>

          <div className="flex w-full overflow-auto px-4">
            {showBlanks ? (
              <MantraTextView
                mantra={currentPage}
                blankIndices={currentBlankIndices}
              />
            ) : (
              <MantraTextView mantra={currentPage} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={goNext}
            disabled={isLast}
            className="rounded border px-4 py-2 disabled:opacity-40"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
