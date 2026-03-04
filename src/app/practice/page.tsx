"use client";

import { useState, useMemo } from "react";
import MantraTextView from "@/component/mantra/mantra-text-view";
import ToggleSwitch from "@/component/layout/toggle-switch";
import PaginationControls from "@/component/layout/pagination-controls";
import TopSettingButton from "@/component/layout/top-setting-button";
import PageRangeLegend from "@/component/settings/page-range-legend";
import { SHURANGAMA_MANTRA_PAGES } from "@/data/shurangama-mantra";
import { createBlankIndices, difficultyToRatio } from "@/lib/blanks";
import { usePagination } from "@/hooks/use-pagination";
import { useSettingStore } from "@/store/setting-store";

type BlankByPage = Record<number, Set<number>>;

export default function PracticePage() {
  const { practice, hasHydrated } = useSettingStore();
  const { pageStart, pageEnd, difficulty } = practice;
  const ratio = difficultyToRatio[difficulty];

  const selectedPages = useMemo(
    () => SHURANGAMA_MANTRA_PAGES.slice(pageStart - 1, pageEnd),
    [pageStart, pageEnd],
  );

  const [showBlanks, setShowBlanks] = useState(false);
  const [blankByPage, setBlankByPage] = useState<BlankByPage>({});

  const {
    currentIndex,
    currentItem: currentPage,
    isFirst,
    isLast,
    goPrev,
    goNext,
    setCurrentIndex,
  } = usePagination({
    items: selectedPages,
  });

  const currentBlankIndices = blankByPage[currentIndex] ?? new Set<number>();

  const handleToggleBlanks = (nextChecked: boolean) => {
    if (nextChecked && Object.keys(blankByPage).length === 0) {
      const nextBlankByPage: BlankByPage = {};

      selectedPages.forEach((page, index) => {
        nextBlankByPage[index] = createBlankIndices(page.mantra, ratio);
      });

      setBlankByPage(nextBlankByPage);
    }

    setShowBlanks(nextChecked);
  };

  const handleResetPractice = () => {
    // 빈칸 정보와 표시 상태를 초기화하고, 현재 설정된 페이지 범위의 첫 페이지로 이동
    setBlankByPage({});
    setShowBlanks(false);
    setCurrentIndex(0);
  };

  if (!currentPage) return null;

  return (
    <div className="mx-auto h-full w-[1000px]">
      <section className="flex w-full h-full min-w-0 flex-col overflow-hidden pr-5 pl-5 pb-5">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-row justify-start gap-5 w-[200px]">
            <ToggleSwitch
              label="빈칸"
              checked={showBlanks}
              onChange={handleToggleBlanks}
            />
          </div>

          <PaginationControls
            isFirst={isFirst}
            isLast={isLast}
            label={hasHydrated ? `${currentPage.pageNumber} / 12` : ""}
            onPrev={goPrev}
            onNext={goNext}
          />

          <TopSettingButton mode="practice" onReset={handleResetPractice} />
        </div>

        <div className="relative min-h-0 flex-1 overflow-auto rounded border border-gray-200 p-4">
          {hasHydrated && (
            <PageRangeLegend
              pageStart={pageStart}
              pageEnd={pageEnd}
              difficulty={difficulty}
            />
          )}
          {hasHydrated ? (
            <div className="min-w-[800px]">
              {showBlanks ? (
                <MantraTextView
                  mantra={currentPage.mantra}
                  blankIndices={currentBlankIndices}
                />
              ) : (
                <MantraTextView mantra={currentPage.mantra} />
              )}
            </div>
          ) : (
            // hydration 전에는 대략적인 높이만 가진 빈 박스를 렌더
            <div className="min-w-[800px] h-[600px]" />
          )}
        </div>
      </section>
    </div>
  );
}
