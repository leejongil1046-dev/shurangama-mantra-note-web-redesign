import type { Difficulty } from "@/store/setting-store";

const difficultyLabel: Record<Difficulty, string> = {
  easy: "하",
  medium: "중",
  hard: "상",
};

type PageRangeLegendProps = {
  pageStart: number;
  pageEnd: number;
  difficulty: Difficulty;
};

export default function PageRangeLegend({
  pageStart,
  pageEnd,
  difficulty,
}: PageRangeLegendProps) {
  return (
    <div
      className="absolute top-3 right-3 flex flex-col gap-0.5 rounded bg-gray-50/95 px-3 py-2 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200/80"
      aria-label="선택 범위 및 난이도"
    >
      <span>
        <span className="font-medium text-gray-500">페이지</span> {pageStart}–
        {pageEnd}
      </span>
      <span>
        <span className="font-medium text-gray-500">난이도</span>{" "}
        {difficultyLabel[difficulty]}
      </span>
    </div>
  );
}
