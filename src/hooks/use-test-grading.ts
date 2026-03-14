"use client";

import { useMemo, useState } from "react";
import { computeGradeResult } from "@/lib/grade-test";
import type { GradeResult } from "@/lib/grade-test";
import type { BlankByPageState } from "@/store/test-store";
import type { MantraPageItem } from "@/types/mantra";
import type { Difficulty } from "@/store/setting-store";

type AnswersByPage = Record<number, Record<number, string>>;

type UseTestGradingParams = {
  blankByPage: BlankByPageState;
  answersByPage: AnswersByPage;
  selectedPages: MantraPageItem[];
  gradeResult: GradeResult | null;
  setGradeResult: (result: GradeResult | null) => void;
  currentPageIndex: number;
  /** null이면 채점/결과 모달 동작 안 함 (난이도 미선택 상태) */
  selectedDifficulty: Difficulty | null;
};

export function useTestGrading({
  blankByPage,
  answersByPage,
  selectedPages,
  gradeResult,
  setGradeResult,
  currentPageIndex,
  selectedDifficulty,
}: UseTestGradingParams) {
  const [isGradeConfirmOpen, setIsGradeConfirmOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const { totalBlanks, filledCount } = useMemo(() => {
    let total = 0;
    let filled = 0;
    Object.keys(blankByPage).forEach((key) => {
      const pageIndex = Number(key);
      const blanks = blankByPage[pageIndex]?.length ?? 0;
      const answers = answersByPage[pageIndex] ?? {};
      total += blanks;
      filled += Object.keys(answers).length;
    });
    return { totalBlanks: total, filledCount: filled };
  }, [blankByPage, answersByPage]);

  const handleGradeClick = () => {
    if (selectedDifficulty === null) return;
    if (gradeResult) {
      setIsResultModalOpen(true);
    } else {
      setIsGradeConfirmOpen(true);
    }
  };

  const handleGradeConfirm = () => {
    if (selectedDifficulty === null) return;
    setIsGradeConfirmOpen(false);
    const result = computeGradeResult(
      blankByPage,
      answersByPage,
      selectedPages,
    );
    setGradeResult(result);
    setIsResultModalOpen(true);
  };

  const gradeDisplay = useMemo(() => {
    if (!gradeResult) return undefined;
    return gradeResult.correctByBlank[currentPageIndex];
  }, [gradeResult, currentPageIndex]);

  return {
    totalBlanks,
    filledCount,
    gradeDisplay,
    isGradeConfirmOpen,
    setIsGradeConfirmOpen,
    isResultModalOpen,
    setIsResultModalOpen,
    handleGradeClick,
    handleGradeConfirm,
  };
}
