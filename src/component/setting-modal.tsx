"use client";

import PageRangeSetting from "@/component/page-range-setting";
import DifficultySetting from "@/component/difficulty-setting";
import { useSettingStore, type Difficulty } from "@/store/setting-store";
import { useMemo, useState } from "react";

export type SettingMode = "practice" | "memorize";

type SettingModalProps = {
  open: boolean;
  onClose?: () => void;
  mode: SettingMode;
};

export default function SettingModal({
  open,
  onClose,
  mode,
}: SettingModalProps) {
  const practice = useSettingStore((s) => s.practice);
  const memorize = useSettingStore((s) => s.memorize);
  const slice = mode === "practice" ? practice : memorize;
  const { pageStart, pageEnd, difficulty } = slice;

  const setPracticePageRange = useSettingStore((s) => s.setPracticePageRange);
  const setPracticeDifficulty = useSettingStore((s) => s.setPracticeDifficulty);
  const setMemorizePageRange = useSettingStore((s) => s.setMemorizePageRange);
  const setMemorizeDifficulty = useSettingStore((s) => s.setMemorizeDifficulty);

  const [tempRange, setTempRange] = useState<[number, number]>([
    pageStart,
    pageEnd,
  ]);
  const [tempDifficulty, setTempDifficulty] = useState<Difficulty>(difficulty);

  const isChanged = useMemo(() => {
    const [tempStart, tempEnd] = tempRange;
    return (
      tempStart !== pageStart ||
      tempEnd !== pageEnd ||
      tempDifficulty !== difficulty
    );
  }, [tempRange, tempDifficulty, pageStart, pageEnd, difficulty]);

  if (!open) return null;

  const handleSave = () => {
    const [start, end] = tempRange;
    if (mode === "practice") {
      setPracticePageRange(start, end);
      setPracticeDifficulty(tempDifficulty);
    } else {
      setMemorizePageRange(start, end);
      setMemorizeDifficulty(tempDifficulty);
    }
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-[1000px] rounded-md bg-white px-6 py-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between p-5">
          <h1 className="text-3xl font-semibold">
            설정 {mode === "practice" ? "(연습하기)" : "(암기하기)"}
          </h1>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded px-2 py-1 text-lg text-gray-500 cursor-pointer hover:bg-gray-100"
            >
              X
            </button>
          )}
        </div>

        <div className="space-y-10 p-5">
          <PageRangeSetting
            totalPages={12}
            value={tempRange}
            onChange={setTempRange}
          />

          <DifficultySetting
            value={tempDifficulty}
            onChange={setTempDifficulty}
          />
        </div>

        <div className="mt-8 flex justify-end p-4">
          <button
            type="button"
            disabled={!isChanged}
            onClick={handleSave}
            className={`rounded-md px-6 py-3 text-sm text-white transition-colors ${
              isChanged
                ? "cursor-pointer bg-gray-900 hover:bg-gray-800"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
