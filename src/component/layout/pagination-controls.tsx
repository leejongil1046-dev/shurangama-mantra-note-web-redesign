import Image from "next/image";

type PaginationControlsProps = {
  isFirst: boolean;
  isLast: boolean;
  label: string;
  onPrev: () => void;
  onNext: () => void;
};

export default function PaginationControls({
  isFirst,
  isLast,
  label,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="flex w-[150px] items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className="flex h-8 w-8 items-center justify-center rounded border disabled:opacity-40 cursor-pointer hover:bg-gray-100"
        aria-label="이전 페이지"
      >
        <Image
          src="/icons/left.svg"
          alt=""
          width={16}
          height={16}
          className="h-4 w-4"
        />
      </button>

      <p className="text-md text-gray-600">{label}</p>

      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        className="flex h-8 w-8 items-center justify-center rounded border disabled:opacity-40 cursor-pointer hover:bg-gray-100"
        aria-label="다음 페이지"
      >
        <Image
          src="/icons/right.svg"
          alt=""
          width={16}
          height={16}
          className="h-4 w-4"
        />
      </button>
    </div>
  );
}
