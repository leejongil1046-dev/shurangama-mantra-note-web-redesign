"use client";

import { useEffect, useMemo } from "react";
import MantraTextView from "@/component/mantra/mantra-text-view";
import { SHURANGAMA_MANTRA_PAGES } from "@/data/shurangama-mantra";
import { createBlankIndices, difficultyToRatio } from "@/lib/blanks";
import { usePagination } from "@/hooks/use-pagination";
import { useSettingStore } from "@/store/setting-store";
import { useMemorizeStore } from "@/store/memorize-store";
import TopSettingButton from "@/component/layout/top-setting-button";
import PaginationControls from "@/component/layout/pagination-controls";
import PageRangeLegend from "@/component/settings/page-range-legend";

export default function MemorizePage() {
  const { memorize, hasHydrated } = useSettingStore();
  const { pageStart, pageEnd, difficulty } = memorize;
  const ratio = difficultyToRatio[difficulty];

  const selectedPages = useMemo(
    () => SHURANGAMA_MANTRA_PAGES.slice(pageStart - 1, pageEnd),
    [pageStart, pageEnd],
  );

  const {
    isActive,
    blankByPage,
    answersByPage,
    lastPageIndex,
    startSession,
    setAnswer,
    setLastPageIndex,
    resetSession,
  } = useMemorizeStore();

  const initialIndex = isActive
    ? Math.min(lastPageIndex, Math.max(selectedPages.length - 1, 0))
    : 0;

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
    initialIndex,
  });

  const currentAnswers = answersByPage[currentIndex] ?? {};

  const handleChangeAnswer = (index: number, value: string) => {
    setAnswer(currentIndex, index, value);
  };

  const currentBlankIndicesArray = blankByPage[currentIndex] ?? [];
  const currentBlankIndices = new Set<number>(currentBlankIndicesArray);

  const handleStartMemorize = () => {
    const nextBlankByPage: Record<number, number[]> = {};

    selectedPages.forEach((page, index) => {
      const indices = createBlankIndices(page.mantra, ratio);
      nextBlankByPage[index] = Array.from(indices);
    });

    startSession({
      blankByPage: nextBlankByPage,
      initialPageIndex: currentIndex,
    });
  };

  const handleFinishMemorize = () => {
    resetSession();
  };

  const handleResetMemorize = () => {
    // 암기 세션 전체를 초기화하고, 현재 설정된 페이지 범위의 첫 페이지로 이동
    resetSession();
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (isActive) {
      setLastPageIndex(currentIndex);
    }
  }, [currentIndex, isActive, setLastPageIndex]);

  if (!currentPage) return null;

  return (
    <div className="mx-auto h-full w-[1000px]">
      <section className="flex w-full h-full min-w-0 flex-col overflow-hidden pr-5 pl-5 pb-5">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-row justify-start gap-3 w-[200px]">
            {hasHydrated &&
              (!isActive ? (
                <button
                  type="button"
                  onClick={handleStartMemorize}
                  className="rounded border w-[80px] py-1 text-sm cursor-pointer hover:bg-gray-100"
                >
                  암기 시작
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded border w-[80px] py-1 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    채점하기
                  </button>
                </>
              ))}
          </div>

          <PaginationControls
            isFirst={isFirst}
            isLast={isLast}
            label={hasHydrated ? `${currentPage.pageNumber} / 12` : ""}
            onPrev={goPrev}
            onNext={goNext}
          />

          <TopSettingButton mode="memorize" onReset={handleResetMemorize} />
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
              {isActive ? (
                <MantraTextView
                  mantra={currentPage.mantra}
                  blankIndices={currentBlankIndices}
                  mode="memorize"
                  answers={currentAnswers}
                  onChangeAnswer={handleChangeAnswer}
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
