import { getFullText } from "@/lib/mantra-format";
import type { Mantra } from "@/types/mantra";
import type { BlankByPageState } from "@/store/test-store";

/** 정답이면 글자 하나, 오답이면 정답/오답 두 개 */
export type BlankGrade =
  | { correct: true; char: string }
  | { correct: false; correctChar: string; wrongChar: string };

export type GradeResult = {
  perPage: Record<
    number,
    { totalChars: number; blanks: number; correct: number; wrong: number }
  >;
  total: { totalChars: number; blanks: number; correct: number; wrong: number };
  correctByBlank: Record<number, Record<number, BlankGrade>>;
};

type AnswersByPage = Record<number, Record<number, string>>;
type PageWithMantra = { mantra: Mantra };

export function computeGradeResult(
  blankByPage: BlankByPageState,
  answersByPage: AnswersByPage,
  pages: PageWithMantra[],
): GradeResult {
  const perPage: GradeResult["perPage"] = {};
  const correctByBlank: GradeResult["correctByBlank"] = {};
  let totalCharsSum = 0;
  let totalBlanks = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  for (const pageIndex of Object.keys(blankByPage).map(Number)) {
    const indices = blankByPage[pageIndex] ?? [];
    const answers = answersByPage[pageIndex] ?? {};
    const page = pages[pageIndex];
    if (!page) continue;

    const fullText = getFullText(page.mantra);
    const pageTotalChars = fullText
      .split("")
      .filter((ch) => ch !== " " && ch !== "\n").length;
    let correct = 0;
    let wrong = 0;
    const byBlank: Record<number, BlankGrade> = {};

    for (const charIndex of indices) {
      const correctChar = fullText[charIndex] ?? "";
      const userAnswer = (answers[charIndex] ?? "").trim();
      const isCorrect = userAnswer === correctChar;
      byBlank[charIndex] = isCorrect
        ? { correct: true, char: correctChar }
        : { correct: false, correctChar, wrongChar: userAnswer };
      if (isCorrect) correct++;
      else wrong++;
    }

    perPage[pageIndex] = {
      totalChars: pageTotalChars,
      blanks: indices.length,
      correct,
      wrong,
    };
    correctByBlank[pageIndex] = byBlank;
    totalCharsSum += pageTotalChars;
    totalBlanks += indices.length;
    totalCorrect += correct;
    totalWrong += wrong;
  }

  return {
    perPage,
    total: {
      totalChars: totalCharsSum,
      blanks: totalBlanks,
      correct: totalCorrect,
      wrong: totalWrong,
    },
    correctByBlank,
  };
}

export function accuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
