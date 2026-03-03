"use client";

import { useState } from "react";
import PageRangeSetting from "../../component/page-range-setting";
import DifficultySetting from "../../component/difficulty-setting";

const TOTAL_PAGES = 12;

export default function SettingPage() {
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(12);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );

  return (
    <div className="flex flex-1 flex-col justify-between mx-auto w-[1000px] px-6 py-10">
      <div className="space-y-15 pt-5">
        <PageRangeSetting
          totalPages={TOTAL_PAGES}
          value={[pageStart, pageEnd]}
          onChange={([start, end]) => {
            setPageStart(start);
            setPageEnd(end);
          }}
        />

        <DifficultySetting value={difficulty} onChange={setDifficulty} />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="rounded-md bg-gray-900 px-6 py-3 text-lg text-white hover:bg-gray-800"
        >
          저장
        </button>
      </div>
    </div>
  );
}
