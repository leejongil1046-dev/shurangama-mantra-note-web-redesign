type ActionButtonProps = {
  label: string;
  onClick: () => void;
  fontSize?: number;
};

export default function ActionButton({
  label,
  onClick,
  fontSize = 18,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md px-3 py-1 font-medium transition-opacity border border-gray-300 bg-transparent text-gray-800 cursor-pointer hover:bg-gray-100"
      style={{ fontSize }}
    >
      {label}
    </button>
  );
}
