"use client";

import { useEffect, useMemo } from "react";
import MantraTextView from "@/component/mantra/mantra-text-view";
import { SHURANGAMA_MANTRA_PAGES } from "@/data/shurangama-mantra";
import { createBlankIndices, difficultyToRatio } from "@/lib/mantra-blank";
import { usePagination } from "@/hooks/use-pagination";
import { useMemorizeGrading } from "@/hooks/use-test-grading";
import { useSettingStore } from "@/store/setting-store";
import { useTestStore } from "@/store/test-store";
import TopSettingButton from "@/component/layout/top-setting-button";
import PaginationControls from "@/component/layout/pagination-controls";
import PageRangeLegend from "@/component/settings/page-range-legend";
import TestActions from "@/component/test/test-actions";
import ConfirmModal from "@/component/ui/confirm-modal";
import GradeResultModal from "@/component/test/grade-result-modal";

export default function TestPage() {
  const { test, hasHydrated, fontSize } = useSettingStore();
  const { pageStart, pageEnd, difficulty } = test;
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
  } = useTestStore();

  const initialIndex = isActive
    ? Math.min(lastPageIndex, Math.max(selectedPages.length - 1, 0))
    : 0;

  const {
    currentIndex: currentPageIndex,
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

  const currentAnswers = answersByPage[currentPageIndex] ?? {};

  const handleChangeAnswer = (index: number, value: string) => {
    setAnswer(currentPageIndex, index, value);
  };

  const currentBlankIndicesArray = useMemo(
    () => blankByPage[currentPageIndex] ?? [],
    [blankByPage, currentPageIndex],
  );
  const currentBlankIndices = new Set<number>(currentBlankIndicesArray);

  const sortedBlankIndices = useMemo(
    () => [...currentBlankIndicesArray].sort((a, b) => a - b),
    [currentBlankIndicesArray],
  );

  const handleStartTest = () => {
    const nextBlankByPage: Record<number, number[]> = {};

    selectedPages.forEach((page, index) => {
      const indices = createBlankIndices(page.mantra, ratio);
      nextBlankByPage[index] = Array.from(indices);
    });

    startSession({
      blankByPage: nextBlankByPage,
      initialPageIndex: currentPageIndex,
    });
  };

  const handleResetTest = () => {
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
    currentPageIndex,
    currentPage: currentPage ?? undefined,
  });

  useEffect(() => {
    if (isActive) {
      setLastPageIndex(currentPageIndex);
    }
  }, [currentPageIndex, isActive, setLastPageIndex]);

  if (!currentPage) return null;

  return (
    <div className="mx-auto h-full w-[1200px]">
      <section className="flex w-full h-full min-w-0 flex-col overflow-hidden pr-5 pl-5 pb-5">
        <div className="flex items-center justify-between p-4">
          <TestActions
            hasHydrated={hasHydrated}
            isActive={isActive}
            isGraded={!!gradeResult}
            onStart={handleStartTest}
            onGrade={handleGradeConfirm}
            onReset={handleResetTest}
          />

          <PaginationControls
            isFirst={isFirst}
            isLast={isLast}
            label={hasHydrated ? `${currentPage.pageNumber} / 12` : ""}
            onPrev={goPrev}
            onNext={goNext}
          />

          <TopSettingButton mode="test" onReset={handleResetTest} />

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
                  mode="test"
                  answers={currentAnswers}
                  onChangeAnswer={gradeResult ? undefined : handleChangeAnswer}
                  gradeDisplay={gradeDisplay}
                  fontSize={fontSize}
                  blankOrder={sortedBlankIndices}
                />
              ) : (
                <MantraTextView
                  mantra={currentPage.mantra}
                  fontSize={fontSize}
                />
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
