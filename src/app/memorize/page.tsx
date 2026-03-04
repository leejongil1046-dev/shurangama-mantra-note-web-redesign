"use client";

import { useState, useMemo } from "react";
import MantraTextView from "@/component/mantra-text-view";
import ToggleSwitch from "@/component/toggle-switch";
import { SHURANGAMA_MANTRA_PAGES } from "@/data/shurangama-mantra";
import { createBlankIndices } from "@/lib/blanks";
import { usePagination } from "@/hooks/use-pagination";
import { useSettingStore } from "@/store/setting-store";
import Image from "next/image";
import SettingModal from "@/component/setting-modal";

type BlankByPage = Record<number, Set<number>>;

const difficultyToRatio = {
  easy: 0.1,
  medium: 0.3,
  hard: 0.5,
} as const;

export default function MemorizePage() {
  const { pageStart, pageEnd, difficulty, hasHydrated } = useSettingStore();
  const ratio = difficultyToRatio[difficulty];

  const selectedPages = useMemo(
    () => SHURANGAMA_MANTRA_PAGES.slice(pageStart - 1, pageEnd),
    [pageStart, pageEnd],
  );

  const {
    currentIndex,
    currentItem: currentPage,
    isFirst,
    isLast,
    goPrev,
    goNext,
  } = usePagination({
    items: selectedPages,
  });

  const [showBlanks, setShowBlanks] = useState(false);
  const [blankByPage, setBlankByPage] = useState<BlankByPage>({});
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [answersByPage, setAnswersByPage] = useState<
    Record<number, Record<number, string>>
  >({});

  const currentAnswers = answersByPage[currentIndex] ?? {};

  const handleChangeAnswer = (index: number, value: string) => {
    setAnswersByPage((prev) => ({
      ...prev,
      [currentIndex]: { ...(prev[currentIndex] ?? {}), [index]: value },
    }));
  };

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

  if (!currentPage) return null;

  console.log(currentAnswers);

  return (
    <div className="mx-auto h-full w-[1000px]">
      <section className="flex w-full h-full min-w-0 flex-col overflow-hidden pr-5 pl-5 pb-5">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-row justify-start gap-5 w-[150px]">
            <ToggleSwitch
              label="빈칸"
              checked={showBlanks}
              onChange={handleToggleBlanks}
            />
          </div>

          <div className="flex w-[150px] items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFirst}
              className="flex h-8 w-8 items-center justify-center rounded border disabled:opacity-40"
              aria-label="이전 페이지"
            >
              <Image
                src="/icons/left.svg"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
            </button>

            <p className="text-md text-gray-600">
              {hasHydrated ? `${currentPage.pageNumber} / 12` : ""}
            </p>

            <button
              type="button"
              onClick={goNext}
              disabled={isLast}
              className="flex h-8 w-8 items-center justify-center rounded border disabled:opacity-40"
              aria-label="다음 페이지"
            >
              <Image
                src="/icons/right.svg"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
            </button>
          </div>

          <div className="flex w-[150px] items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSettingOpen(true)}
              className="flex h-[35px] w-[35px] items-center justify-center rounded cursor-pointer hover:bg-gray-100"
              aria-label="설정"
            >
              <Image
                src="/icons/setting.svg"
                alt="설정"
                width={30}
                height={30}
              />
            </button>

            {isSettingOpen && (
              <SettingModal
                open
                pageStart={pageStart}
                pageEnd={pageEnd}
                difficulty={difficulty}
                onClose={() => setIsSettingOpen(false)}
              />
            )}
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overflow-auto rounded border border-gray-200 p-4"
          style={{ backgroundAttachment: "local" }}
        >
          {hasHydrated ? (
            <div className="min-w-[800px]">
              {showBlanks ? (
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
