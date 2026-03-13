"use client";

import { useMemo, useState } from "react";
import { computeGradeResult } from "@/lib/grade-test";
import type { GradeResult } from "@/lib/grade-test";
import { getFullText } from "@/lib/mantra-format";
import type { BlankByPageState } from "@/store/test-store";
import type { MantraPageItem } from "@/types/mantra";

type AnswersByPage = Record<number, Record<number, string>>;

type UseTestGradingParams = {
  blankByPage: BlankByPageState;
  answersByPage: AnswersByPage;
  selectedPages: MantraPageItem[];
  gradeResult: GradeResult | null;
  setGradeResult: (result: GradeResult | null) => void;
  currentPageIndex: number;
  currentPage: MantraPageItem | undefined;
};

export function useTestGrading({
  blankByPage,
  answersByPage,
  selectedPages,
  gradeResult,
  setGradeResult,
  currentPageIndex,
  currentPage,
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
    if (gradeResult) {
      setIsResultModalOpen(true);
    } else {
      setIsGradeConfirmOpen(true);
    }
  };

  const handleGradeConfirm = () => {
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
    if (!gradeResult || !currentPage) return undefined;
    const fullText = getFullText(currentPage.mantra);
    const byBlank = gradeResult.correctByBlank[currentPageIndex];
    if (!byBlank) return undefined;
    const out: Record<number, { correctChar: string; isCorrect: boolean }> = {};
    for (const charIndex of Object.keys(byBlank).map(Number)) {
      out[charIndex] = {
        correctChar: fullText[charIndex] ?? "",
        isCorrect: byBlank[charIndex],
      };
    }
    return out;
  }, [gradeResult, currentPage, currentPageIndex]);

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
