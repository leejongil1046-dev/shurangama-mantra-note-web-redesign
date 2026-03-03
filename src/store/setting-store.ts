import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Difficulty = "easy" | "medium" | "hard";

type SettingState = {
  // 저장된(실제 사용되는) 설정값
  pageStart: number;
  pageEnd: number;
  difficulty: Difficulty;

  // hydration 여부
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  // 저장된 값을 변경하는 액션 (연습하기에서 사용)
  setPageRange: (start: number, end: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
};

const TOTAL_PAGES = 12;

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      pageStart: 1,
      pageEnd: TOTAL_PAGES,
      difficulty: "easy",
      hasHydrated: false,
      setPageRange: (start, end) => {
        const normalizedStart = Math.max(1, Math.min(start, TOTAL_PAGES));
        const normalizedEnd = Math.max(
          normalizedStart,
          Math.min(end, TOTAL_PAGES),
        );
        set({ pageStart: normalizedStart, pageEnd: normalizedEnd });
      },
      setDifficulty: (difficulty) => set({ difficulty }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "setting-store",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
