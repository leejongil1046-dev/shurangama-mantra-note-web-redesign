"use client";

import { useState, useMemo } from "react";
import MantraTextView from "@/component/mantra/mantra-text-view";
import PaginationControls from "@/component/layout/pagination-controls";
import TopSettingButton from "@/component/layout/top-setting-button";
import PageRangeLegend from "@/component/settings/page-range-legend";
import { SHURANGAMA_MANTRA_PAGES } from "@/data/shurangama-mantra";
import { createBlankIndices, difficultyToRatio } from "@/lib/mantra-blank";
import { usePagination } from "@/hooks/use-pagination";
import { useSettingStore, type Difficulty } from "@/store/setting-store";
// import ModalActionButton from "@/component/ui/modal-action-button";
import ActionButton from "@/component/ui/action-button";

type BlankByPage = Record<number, Set<number>>;

export default function PracticePage() {
  const { practice, hasHydrated, fontSize } = useSettingStore();
  const { pageStart, pageEnd, difficulty } = practice;
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

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

  const regenerateBlanks = (targetDifficulty: Difficulty) => {
    const targetRatio = difficultyToRatio[targetDifficulty];
    const nextBlankByPage: BlankByPage = {};

    selectedPages.forEach((page, index) => {
      nextBlankByPage[index] = createBlankIndices(page.mantra, targetRatio);
    });

    setBlankByPage(nextBlankByPage);
  };

  const handleSelectDifficulty = (targetDifficulty: Difficulty) => {
    // 난이도 변경 시: 인덱스를 처음으로, 빈칸 초기화 후 새 난이도로 다시 생성
    setSelectedDifficulty(targetDifficulty);
    setCurrentIndex(0);
    setBlankByPage({});
    setShowBlanks(true);
    useSettingStore.getState().setPracticeDifficulty(targetDifficulty);
    regenerateBlanks(targetDifficulty);
  };

  const handleResetPractice = () => {
    setSelectedDifficulty(null);
    setBlankByPage({});
    setShowBlanks(false);
    setCurrentIndex(0);
  };

  if (!currentPage) return null;

  return (
    <div className="mx-auto h-full w-[1200px]">
      <section className="flex w-full h-full min-w-0 flex-col overflow-hidden pr-5 pl-5 pb-5">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-row justify-start gap-5 w-[400px]">
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
            <ActionButton label="초기화" onClick={handleResetPractice} />
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
              difficulty={selectedDifficulty ?? difficulty}
            />
          )}
          {hasHydrated ? (
            <div className="min-w-[800px]">
              {showBlanks ? (
                <MantraTextView
                  mantra={currentPage.mantra}
                  blankIndices={currentBlankIndices}
                  fontSize={fontSize}
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
