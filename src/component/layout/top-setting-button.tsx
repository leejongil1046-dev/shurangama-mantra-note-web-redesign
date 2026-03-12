import { useState } from "react";
import Image from "next/image";
import SettingModal, {
  type SettingMode,
} from "@/component/settings/setting-modal";
import ConfirmModal, { type ConfirmMode } from "@/component/ui/confirm-modal";
import { useSettingStore } from "@/store/setting-store";
import ActionButton from "../ui/action-button";

type TopSettingButtonProps = {
  mode: SettingMode;
  onReset?: () => void;
};

export default function TopSettingButton({
  mode,
  onReset,
}: TopSettingButtonProps) {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const { increaseFontSize, decreaseFontSize } = useSettingStore();
  const confirmMode: ConfirmMode =
    mode === "practice" ? "reset-practice" : "reset-test";

  const handleClickReset = () => {
    if (!onReset) return;
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="flex w-[400px] items-center justify-end gap-3">
      {/* <button
        type="button"
        onClick={increaseFontSize}
        className="flex h-[35px] w-[35px] items-center justify-center rounded cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="글자_크기_확대"
      >
        <Image src="/icons/zoom_in.svg" alt="글자_크기_확대" width={30} height={30} />
      </button>
      <button
        type="button"
        onClick={decreaseFontSize}
        className="flex h-[35px] w-[35px] items-center justify-center rounded cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="글자_크기_축소"
      >
        <Image src="/icons/zoom_out.svg" alt="글자_크기_축소" width={30} height={30} />
      </button> */}
      <ActionButton label="글자 크기 확대" onClick={increaseFontSize} />
      <ActionButton label="글자 크기 축소" onClick={decreaseFontSize} />
      {/* <button
        type="button"
        onClick={handleClickReset}
        className="flex h-[35px] w-[35px] items-center justify-center rounded cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="초기화"
        disabled={!onReset}
      >
        <Image src="/icons/restart.svg" alt="초기화" width={30} height={30} />
      </button> */}
      {/* <button
        type="button"
        onClick={() => setIsSettingOpen(true)}
        className="flex h-[35px] w-[35px] items-center justify-center rounded cursor-pointer hover:bg-gray-100"
        aria-label="설정"
      >
        <Image src="/icons/setting.svg" alt="설정" width={30} height={30} />
      </button> */}
      <ActionButton label="설정" onClick={() => setIsSettingOpen(true)} />

      {isSettingOpen && (
        <SettingModal
          open
          mode={mode}
          onClose={() => setIsSettingOpen(false)}
        />
      )}

      <ConfirmModal
        open={isResetConfirmOpen}
        mode={confirmMode}
        onConfirm={handleConfirmReset}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
