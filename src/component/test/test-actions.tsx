import ActionButton from "../ui/action-button";

const buttonClass =
  "rounded border w-[80px] py-1 text-sm cursor-pointer hover:bg-gray-100";

type MemorizeActionsProps = {
  hasHydrated: boolean;
  isActive: boolean;
  /** 채점 완료 여부. true면 버튼이 "결과확인"으로 표시됨 */
  isGraded?: boolean;
  onStart: () => void;
  onGrade?: () => void;
  onReset?: () => void;
};

export default function MemorizeActions({
  hasHydrated,
  isActive,
  isGraded = false,
  onStart,
  onGrade,
  onReset,
}: MemorizeActionsProps) {
  if (!hasHydrated)
    return <div className="flex flex-row justify-start gap-3 w-[400px]" />;

  if (!isActive) {
    return (
      <div className="flex flex-row justify-start gap-3 w-[400px]">
        {/* <button type="button" onClick={onStart} className={buttonClass}>
          암기 시작
        </button> */}
        <ActionButton label="암기 시작" onClick={onStart} />
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-start gap-3 w-[400px]">
      {/* <button
        type="button"
        onClick={onGrade}
        disabled={!onGrade}
        className={buttonClass + (onGrade ? "" : " opacity-60 cursor-default")}
      >
        {isGraded ? "결과확인" : "채점하기"}
      </button>  */}
      <ActionButton label={isGraded ? "결과확인" : "채점하기"} onClick={onGrade} />
      <ActionButton label="초기화" onClick={onReset} />
    </div>
  );
}
