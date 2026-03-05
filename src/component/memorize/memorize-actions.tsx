const buttonClass =
  "rounded border w-[80px] py-1 text-sm cursor-pointer hover:bg-gray-100";

type MemorizeActionsProps = {
  hasHydrated: boolean;
  isActive: boolean;
  onStart: () => void;
  onGrade?: () => void;
  onFinish?: () => void;
};

export default function MemorizeActions({
  hasHydrated,
  isActive,
  onStart,
  onGrade,
  onFinish,
}: MemorizeActionsProps) {
  if (!hasHydrated) return <div className="flex flex-row justify-start gap-3 w-[200px]" />;

  if (!isActive) {
    return (
      <div className="flex flex-row justify-start gap-3 w-[200px]">
        <button
          type="button"
          onClick={onStart}
          className={buttonClass}
        >
          암기 시작
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-start gap-3 w-[200px]">
      <button
        type="button"
        onClick={onGrade}
        disabled={!onGrade}
        className={buttonClass + (onGrade ? "" : " opacity-60 cursor-default")}
      >
        채점하기
      </button>
      {onFinish && (
        <button type="button" onClick={onFinish} className={buttonClass}>
          종료하기
        </button>
      )}
    </div>
  );
}
