"use client";

export type ConfirmMode = "reset-practice" | "reset-memorize";

type ConfirmModalProps = {
  open: boolean;
  mode: ConfirmMode;
  onConfirm: () => void;
  onClose: () => void;
};

const PRESET = {
  "reset-practice": {
    title: "연습하기 상태를 초기화할까요?",
    description:
      "현재 페이지 범위와 난이도는 유지한 채, 생성된 빈칸을 모두 지우고 빈칸 모드를 해제한 뒤 첫 페이지로 이동합니다.",
    confirmLabel: "초기화",
    cancelLabel: "취소",
  },
  "reset-memorize": {
    title: "암기하기 상태를 초기화할까요?",
    description:
      "현재 페이지 범위와 난이도는 유지한 채, 암기하기의 빈칸과 입력한 답을 모두 지우고 첫 페이지로 이동합니다.",
    confirmLabel: "초기화",
    cancelLabel: "취소",
  },
} as const;

export default function ConfirmModal({
  open,
  mode,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null;

  const { title, description, confirmLabel, cancelLabel } = PRESET[mode];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">{title}</h2>
        <div className="mb-6 text-md leading-relaxed text-gray-600">
          {description}
        </div>
        <div className="flex justify-end gap-3 text-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded bg-gray-900 px-4 py-2 text-white cursor-pointer hover:bg-gray-800"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
