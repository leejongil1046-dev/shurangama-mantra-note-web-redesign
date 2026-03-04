type ToggleSwitchProps = {
  label: string;
  checked: boolean;
  onChange: (nextChecked: boolean) => void;
  disabled?: boolean;
};

export default function ToggleSwitch({
  label,
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={checked}
      className="flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="text-xl text-gray-600 font-medium">{label}</span>

      <span
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer hover:bg-gray-400 ${
          checked ? "bg-gray-800 hover:bg-gray-800" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}
