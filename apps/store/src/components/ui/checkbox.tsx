type Props = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

export function Checkbox({
  label,
  checked,
  onChange,
}: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-3">

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-black"
      />

      <span>{label}</span>

    </label>
  );
}