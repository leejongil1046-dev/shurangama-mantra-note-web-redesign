import { useState } from "react";
import Image from "next/image";
import SettingModal, { type SettingMode } from "@/component/setting-modal";

type TopSettingButtonProps = {
  mode: SettingMode;
};

export default function TopSettingButton({ mode }: TopSettingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-[200px] items-center justify-end gap-3">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-[35px] w-[35px] items-center justify-center rounded cursor-pointer hover:bg-gray-100"
        aria-label="설정"
      >
        <Image src="/icons/setting.svg" alt="설정" width={30} height={30} />
      </button>

      {isOpen && (
        <SettingModal open mode={mode} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
