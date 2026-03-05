"use client";

import { accuracy } from "@/lib/grade-memorize";
import type { GradeResult } from "@/lib/grade-memorize";
import type { Difficulty } from "@/store/setting-store";

const difficultyLabel: Record<Difficulty, string> = {
  easy: "하",
  medium: "중",
  hard: "상",
};

type GradeResultModalProps = {
  open: boolean;
  onClose: () => void;
  gradeResult: GradeResult;
  pageNumbers: number[];
  difficulty: Difficulty;
};

export default function GradeResultModal({
  open,
  onClose,
  gradeResult,
  pageNumbers,
  difficulty,
}: GradeResultModalProps) {
  if (!open) return null;

  const { perPage, total } = gradeResult;
  const pageIndices = Object.keys(perPage)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-xl font-semibold text-gray-900">채점 결과</h2>
        <p className="mb-4 text-sm text-gray-500">
          난이도: {difficultyLabel[difficulty]}
        </p>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="py-2 pr-4">페이지</th>
                <th className="py-2 pr-4 text-right">전체 글자수</th>
                <th className="py-2 pr-4 text-right">빈칸</th>
                <th className="py-2 pr-4 text-right">맞춤</th>
                <th className="py-2 pr-4 text-right">틀림</th>
                <th className="py-2 text-right">정답률</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {pageIndices.map((pageIndex) => {
                const stats = perPage[pageIndex];
                const pageNumber = pageNumbers[pageIndex] ?? pageIndex + 1;
                const pct = accuracy(stats.correct, stats.blanks);
                return (
                  <tr key={pageIndex} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{pageNumber}페이지</td>
                    <td className="py-2 pr-4 text-right">
                      {stats.totalChars ?? "-"}
                    </td>
                    <td className="py-2 pr-4 text-right">{stats.blanks}</td>
                    <td className="py-2 pr-4 text-right text-blue-600">
                      {stats.correct}
                    </td>
                    <td className="py-2 pr-4 text-right text-red-600">
                      {stats.wrong}
                    </td>
                    <td className="py-2 text-right">{pct}%</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-300 font-medium">
                <td className="py-2 pr-4">전체</td>
                <td className="py-2 pr-4 text-right">
                  {total.totalChars ?? "-"}
                </td>
                <td className="py-2 pr-4 text-right">{total.blanks}</td>
                <td className="py-2 pr-4 text-right text-blue-600">
                  {total.correct}
                </td>
                <td className="py-2 pr-4 text-right text-red-600">
                  {total.wrong}
                </td>
                <td className="py-2 text-right">
                  {accuracy(total.correct, total.blanks)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
