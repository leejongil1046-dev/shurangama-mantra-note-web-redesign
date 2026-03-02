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

  const handleCreateBlanks = () => {
    if (Object.keys(blankByPage).length === 0) {
      const nextBlankByPage: BlankByPage = {};

      SHURANGAMA_MANTRA_PAGES.forEach((page, index) => {
        nextBlankByPage[index] = createBlankIndices(page);
      });

      setBlankByPage(nextBlankByPage);
    }

    setShowBlanks(true);
  };

  const handleShowOriginal = () => {
    setShowBlanks(false);
  };

  if (!currentPage) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4">
      <div className="grid w-screen h-screen grid-cols-[120px_1fr_120px]">
        <div className="flex items-center justify-center">
          <button onClick={goPrev} disabled={isFirst}>
            이전
          </button>
        </div>
        <div className="w-full">
          <div className="flex gap-3">
            <button onClick={handleCreateBlanks}>빈칸 만들기</button>
            <button onClick={handleShowOriginal}>원문 보기</button>
          </div>

          <div className="flex w-full">
            {showBlanks ? (
              <MantraTextView
                mantra={currentPage}
                blankIndices={currentBlankIndices}
              />
            ) : (
              <MantraTextView mantra={currentPage} />
            )}
          </div>

          <p>
            {currentIndex + 1} / {total}
          </p>
        </div>

        <div className="flex items-center justify-center">
          <button onClick={goNext} disabled={isLast}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
