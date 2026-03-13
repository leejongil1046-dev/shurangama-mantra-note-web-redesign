"use client";

import PageRangeSetting from "@/component/settings/page-range-setting";
import DifficultySetting from "@/component/settings/difficulty-setting";
import ModalActionButton from "@/component/ui/modal-action-button";
import { useSettingStore, type Difficulty } from "@/store/setting-store";
import { useTestStore } from "@/store/test-store";
import { useMemo, useState } from "react";

export type SettingMode = "practice" | "test";

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
  const test = useSettingStore((s) => s.test);
  const slice = mode === "practice" ? practice : test;
  // const { pageStart, pageEnd, difficulty } = slice;
  const { pageStart, pageEnd } = slice;

  const setPracticePageRange = useSettingStore((s) => s.setPracticePageRange);
  // const setPracticeDifficulty = useSettingStore((s) => s.setPracticeDifficulty);
  const setTestPageRange = useSettingStore((s) => s.setTestPageRange);
  // const setTestDifficulty = useSettingStore((s) => s.setTestDifficulty);
  const resetTestSession = useTestStore((s) => s.resetSession);

  const [tempRange, setTempRange] = useState<[number, number]>([
    pageStart,
    pageEnd,
  ]);
  // const [tempDifficulty, setTempDifficulty] = useState<Difficulty>(difficulty);

  // const isChanged = useMemo(() => {
  //   const [tempStart, tempEnd] = tempRange;
  //   return (
  //     tempStart !== pageStart ||
  //     tempEnd !== pageEnd ||
  //     tempDifficulty !== difficulty
  //   );
  // }, [tempRange, tempDifficulty, pageStart, pageEnd, difficulty]);

  const isChanged = useMemo(() => {
    const [tempStart, tempEnd] = tempRange;
    return (
      tempStart !== pageStart ||
      tempEnd !== pageEnd
    );
  }, [tempRange, pageStart, pageEnd]);

  if (!open) return null;

  const handleSave = () => {
    const [start, end] = tempRange;
    if (mode === "practice") {
      setPracticePageRange(start, end);
      // setPracticeDifficulty(tempDifficulty);
    } else {
      setTestPageRange(start, end);
      // setTestDifficulty(tempDifficulty);
      resetTestSession();
    }
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-[800px] rounded-xl bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-xl font-semibold">
            설정 {mode === "practice" ? "(연습하기)" : "(게임하기)"}
          </h1>
        </div>

        <div className="space-y-6 p-6">
          <PageRangeSetting
            totalPages={12}
            value={tempRange}
            onChange={setTempRange}
          />

          {/* <DifficultySetting
            value={tempDifficulty}
            onChange={setTempDifficulty}
          /> */}
        </div>

        <div className="mt-0 flex justify-end gap-3 p-6">
          {onClose && (
            <ModalActionButton
              label="취소"
              variant="cancel"
              onClick={onClose}
            />
          )}

          <ModalActionButton
            label="저장"
            variant={isChanged ? "primary" : "primaryDisabled"}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}