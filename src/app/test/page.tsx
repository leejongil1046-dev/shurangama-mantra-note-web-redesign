"use client";

import { useMemo, useState } from "react";
import MantraTextView from "@/component/mantra/mantra-text-view";
import { SHURANGAMA_MANTRA_PAGES } from "@/data/shurangama-mantra";
import { createBlankIndices, difficultyToRatio } from "@/lib/mantra-blank";
import { usePagination } from "@/hooks/use-pagination";
import { useTestGrading } from "@/hooks/use-test-grading";
import { type Difficulty, useSettingStore } from "@/store/setting-store";
import TopSettingButton from "@/component/layout/top-setting-button";
import PaginationControls from "@/component/layout/pagination-controls";
import PageRangeLegend from "@/component/settings/page-range-legend";
import ConfirmModal from "@/component/ui/confirm-modal";
import GradeResultModal from "@/component/test/grade-result-modal";
import ActionButton from "@/component/ui/action-button";
import type { GradeResult } from "@/lib/grade-test";

type BlankByPageState = Record<number, number[]>;
type AnswersByPageState = Record<number, Record<number, string>>;

export default function TestPage() {
  const { test, hasHydrated, fontSize } = useSettingStore();
  const { pageStart, pageEnd } = test;

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [blankByPage, setBlankByPage] = useState<BlankByPageState>({});
  const [answersByPage, setAnswersByPage] = useState<AnswersByPageState>({});
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [showWrongInputs, setShowWrongInputs] = useState(false);

  const selectedPages = useMemo(
    () => SHURANGAMA_MANTRA_PAGES.slice(pageStart - 1, pageEnd),
    [pageStart, pageEnd],
  );

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
  });

  const currentAnswers = answersByPage[currentPageIndex] ?? {};

  const handleChangeAnswer = (index: number, value: string) => {
    setAnswersByPage((prev) => ({
      ...prev,
      [currentPageIndex]: {
        ...(prev[currentPageIndex] ?? {}),
        [index]: value,
      },
    }));
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

  const hasWrongWithInput = useMemo(() => {
    if (!gradeResult) return false;
    for (const pageBlanks of Object.values(gradeResult.correctByBlank)) {
      for (const g of Object.values(pageBlanks)) {
        if (!g.correct && g.wrongChar.trim() !== "") return true;
      }
    }
    return false;
  }, [gradeResult]);

  const handleResetTest = () => {
    setIsActive(false);
    setBlankByPage({});
    setAnswersByPage({});
    setGradeResult(null);
    setShowWrongInputs(false);
    setSelectedDifficulty(null);
    setCurrentIndex(0);
  };

  const createBlankByPageForDifficulty = (
    targetDifficulty: Difficulty,
  ): Record<number, number[]> => {
    const targetRatio = difficultyToRatio[targetDifficulty];
    const nextBlankByPage: Record<number, number[]> = {};

    selectedPages.forEach((page, index) => {
      const indices = createBlankIndices(page.mantra, targetRatio);
      nextBlankByPage[index] = Array.from(indices);
    });

    return nextBlankByPage;
  };

  const handleSelectDifficulty = (targetDifficulty: Difficulty) => {
    const nextBlankByPage = createBlankByPageForDifficulty(targetDifficulty);

    setIsActive(true);
    setSelectedDifficulty(targetDifficulty);
    setBlankByPage(nextBlankByPage);
    setAnswersByPage({});
    setGradeResult(null);
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
  } = useTestGrading({
    blankByPage,
    answersByPage,
    selectedPages,
    gradeResult,
    setGradeResult,
    currentPageIndex,
    selectedDifficulty,
  });

  if (!currentPage) return null;

  return (
    <div className="mx-auto h-full w-[1200px]">
      <section className="flex w-full h-full min-w-0 flex-col overflow-hidden pr-5 pl-5 pb-5">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-row justify-start gap-5 w-[450px]">
            <ActionButton
              label="초급"
              onClick={() => handleSelectDifficulty("easy")}
              isSelected={selectedDifficulty === "easy"}
            />
            <ActionButton
              label="중급"
              onClick={() => handleSelectDifficulty("medium")}
              isSelected={selectedDifficulty === "medium"}
            />
            <ActionButton
              label="고급"
              onClick={() => handleSelectDifficulty("hard")}
              isSelected={selectedDifficulty === "hard"}
            />
            {gradeResult ? (<>
              <ActionButton label="결과확인" onClick={handleGradeConfirm} />
              {hasWrongWithInput && (
                <ActionButton
                  label={showWrongInputs ? "정답보기" : "오답보기"}
                  onClick={() => setShowWrongInputs((s) => !s)}
                  isSelected={showWrongInputs}
                />
              )}
            </>)
              : <ActionButton label="채점하기" onClick={handleGradeConfirm} />
            }
          </div>

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
              difficulty={selectedDifficulty ?? "easy"}
            />
          )}
        </div>

        <div className="relative min-h-0 flex-1 overflow-auto rounded border border-gray-200 p-4">
          {hasHydrated && (
            <PageRangeLegend
              pageStart={pageStart}
              pageEnd={pageEnd}
              difficulty={selectedDifficulty ?? "easy"}
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
                  showWrongInputForAll={showWrongInputs}
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
