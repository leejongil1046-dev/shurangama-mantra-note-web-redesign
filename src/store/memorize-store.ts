import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GradeResult } from "@/lib/grade-memorize";

export type BlankByPageState = Record<number, number[]>;

type AnswersByPageState = Record<number, Record<number, string>>;

type MemorizeState = {
  isActive: boolean;
  blankByPage: BlankByPageState;
  answersByPage: AnswersByPageState;
  lastPageIndex: number;
  /** 채점 결과. 있으면 본문은 정답 표시+색상, 버튼은 결과확인 */
  gradeResult: GradeResult | null;
  startSession: (params: {
    blankByPage: BlankByPageState;
    initialPageIndex: number;
  }) => void;
  setAnswer: (pageIndex: number, charIndex: number, value: string) => void;
  setLastPageIndex: (index: number) => void;
  setGradeResult: (result: GradeResult | null) => void;
  resetSession: () => void;
};

export const useMemorizeStore = create<MemorizeState>()(
  persist(
    (set) => ({
      isActive: false,
      blankByPage: {},
      answersByPage: {},
      lastPageIndex: 0,
      gradeResult: null,
      startSession: ({ blankByPage, initialPageIndex }) =>
        set({
          isActive: true,
          blankByPage,
          answersByPage: {},
          lastPageIndex: initialPageIndex,
        }),
      setAnswer: (pageIndex, charIndex, value) =>
        set((state) => ({
          answersByPage: {
            ...state.answersByPage,
            [pageIndex]: {
              ...(state.answersByPage[pageIndex] ?? {}),
              [charIndex]: value,
            },
          },
        })),
      setLastPageIndex: (index) => set({ lastPageIndex: index }),
      setGradeResult: (result) => set({ gradeResult: result }),
      resetSession: () =>
        set({
          isActive: false,
          blankByPage: {},
          answersByPage: {},
          lastPageIndex: 0,
          gradeResult: null,
        }),
    }),
    {
      name: "memorize-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
