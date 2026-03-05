"use client";

import { useEffect, useMemo } from "react";
import MantraTextView from "@/component/mantra/mantra-text-view";
import { SHURANGAMA_MANTRA_PAGES } from "@/data/shurangama-mantra";
import { createBlankIndices, difficultyToRatio } from "@/lib/blanks";
import { usePagination } from "@/hooks/use-pagination";
import { useMemorizeGrading } from "@/hooks/use-memorize-grading";
import { useSettingStore } from "@/store/setting-store";
import { useMemorizeStore } from "@/store/memorize-store";
import TopSettingButton from "@/component/layout/top-setting-button";
import PaginationControls from "@/component/layout/pagination-controls";
import PageRangeLegend from "@/component/settings/page-range-legend";
import MemorizeActions from "@/component/memorize/memorize-actions";
import ConfirmModal from "@/component/ui/confirm-modal";
import GradeResultModal from "@/component/memorize/grade-result-modal";

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
    gradeResult,
    startSession,
    setAnswer,
    setLastPageIndex,
    setGradeResult,
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

  const handleResetMemorize = () => {
    resetSession();
    setCurrentIndex(0);
  };

  const {
    totalBlanks,
    filledCount,
    gradeDisplay,
    isGradeConfirmOpen,
    setIsGradeConfirmOpen,
    isResultModalOpen,
    setIsResultModalOpen,
    handleGradeClick,
    handleGradeConfirm,
  } = useMemorizeGrading({
    blankByPage,
    answersByPage,
    selectedPages,
    gradeResult,
    setGradeResult,
    currentIndex,
    currentPage: currentPage ?? undefined,
  });

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
          <MemorizeActions
            hasHydrated={hasHydrated}
            isActive={isActive}
            isGraded={!!gradeResult}
            onStart={handleStartMemorize}
            onGrade={handleGradeClick}
          />

          <PaginationControls
            isFirst={isFirst}
            isLast={isLast}
            label={hasHydrated ? `${currentPage.pageNumber} / 12` : ""}
            onPrev={goPrev}
            onNext={goNext}
          />

          <TopSettingButton mode="memorize" onReset={handleResetMemorize} />

          <ConfirmModal
            open={isGradeConfirmOpen}
            mode="grade-with-blanks"
            params={{ totalBlanks, filledCount }}
            onConfirm={handleGradeConfirm}
            onClose={() => setIsGradeConfirmOpen(false)}
          />

          {gradeResult && (
            <GradeResultModal
              open={isResultModalOpen}
              onClose={() => setIsResultModalOpen(false)}
              gradeResult={gradeResult}
              pageNumbers={selectedPages.map((p) => p.pageNumber)}
              difficulty={difficulty}
            />
          )}
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
                  onChangeAnswer={gradeResult ? undefined : handleChangeAnswer}
                  gradeDisplay={gradeDisplay}
                />
              ) : (
                <MantraTextView mantra={currentPage.mantra} />
              )}
            </div>
          ) : (
            <div className="min-w-[800px] h-[600px]" />
          )}
        </div>
      </section>
    </div>
  );
}
