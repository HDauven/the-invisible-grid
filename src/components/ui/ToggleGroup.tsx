"use client";

export type ToggleOption<T extends string> = {
  value: T;
  label: string;
};

type ToggleGroupProps<T extends string> = {
  label: string;
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
};

export function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange
}: ToggleGroupProps<T>) {
  return (
    <div className="control">
      <span className="control-label">{label}</span>
      <div className="toggle-group" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            className="toggle-button"
            data-active={option.value === value}
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
