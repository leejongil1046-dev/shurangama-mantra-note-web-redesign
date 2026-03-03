"use client";

import { useState } from "react";
import MantraTextView from "@/component/mantra-text-view";
import ToggleSwitch from "@/component/toggle-switch";
import PageNavigation from "@/component/page-navigation";
import { SHURANGAMA_MANTRA_PAGES } from "@/data/shurangama-mantra";
import { createBlankIndices } from "@/lib/blanks";
import { usePagination } from "@/hooks/use-pagination";

type BlankByPage = Record<number, Set<number>>;

export default function PracticePage() {
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
    goTo,
  } = usePagination({
    items: SHURANGAMA_MANTRA_PAGES,
  });

  const currentBlankIndices = blankByPage[currentIndex] ?? new Set<number>();

  const handleToggleBlanks = (nextChecked: boolean) => {
    if (nextChecked && Object.keys(blankByPage).length === 0) {
      const nextBlankByPage: BlankByPage = {};

      SHURANGAMA_MANTRA_PAGES.forEach((page, index) => {
        nextBlankByPage[index] = createBlankIndices(page.mantra);
      });

      setBlankByPage(nextBlankByPage);
    }

    setShowBlanks(nextChecked);
  };

  if (!currentPage) return null;

  return (
    <div className="grid h-[calc(100vh-64px)] grid-cols-[220px_1fr] overflow-hidden">
      <PageNavigation
        pages={SHURANGAMA_MANTRA_PAGES}
        currentIndex={currentIndex}
        onSelectPage={goTo}
      />

      <section className="flex h-full min-w-0 flex-col overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4">
          <ToggleSwitch
            label="빈칸"
            checked={showBlanks}
            onChange={handleToggleBlanks}
          />

          <p className="text-sm text-[var(--accent-muted)]">
            {currentPage.pageNumber} / {total}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-[var(--mantra-border)] bg-[var(--mantra-bg)] p-6 shadow-sm">
          <div className="min-w-[800px] ">
            {showBlanks ? (
              <MantraTextView
                mantra={currentPage.mantra}
                blankIndices={currentBlankIndices}
              />
            ) : (
              <MantraTextView mantra={currentPage.mantra} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            className="rounded-xl border border-[var(--mantra-border)] bg-[var(--mantra-bg)] px-5 py-2.5 text-[var(--foreground)] transition-colors hover:bg-[var(--mantra-border)]/30 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            이전
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={isLast}
            className="rounded-xl border border-[var(--mantra-border)] bg-[var(--mantra-bg)] px-5 py-2.5 text-[var(--foreground)] transition-colors hover:bg-[var(--mantra-border)]/30 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            다음
          </button>
        </div>
      </section>
    </div>
  );
}
