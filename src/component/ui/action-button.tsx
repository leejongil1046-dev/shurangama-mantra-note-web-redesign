type ActionButtonProps = {
  label: string;
  onClick: () => void;
  fontSize?: number;
  isSelected?: boolean;
};

export default function ActionButton({
  label,
  onClick,
  fontSize = 18,
  isSelected = false,
}: ActionButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-md px-3 py-1 font-medium border transition-colors";
  const selectedClass =
    "border-gray-900 bg-gray-900 text-white cursor-default";
  const defaultClass =
    "border-gray-300 bg-transparent text-gray-800 hover:bg-gray-100 cursor-pointer";

  return (
    <button
      type="button"
      onClick={isSelected ? undefined : onClick}
      disabled={isSelected}
      className={`${baseClass} ${isSelected ? selectedClass : defaultClass}`}
      style={{ fontSize }}
    >
      {label}
    </button>
  );
}
