type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "하" },
  { value: "medium", label: "중" },
  { value: "hard", label: "상" },
];

type DifficultySettingProps = {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
};

export default function DifficultySetting({
  value,
  onChange,
}: DifficultySettingProps) {
  return (
    <section className="flex items-center justify-between gap-8">
      <div className="min-w-[140px] space-y-1">
        <h2 className="text-2xl font-medium text-gray-800">난이도</h2>
        <p className="text-md text-gray-500">
          빈칸 개수(비율)에 따른 난이도를 선택합니다.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {DIFFICULTY_OPTIONS.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex h-10 w-16 items-center justify-center rounded-md border text-md transition-colors cursor-pointer ${
                isActive
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
