"use client";

type SliderProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
  onChange: (value: number) => void;
};

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  leftLabel,
  rightLabel,
  onChange
}: SliderProps) {
  return (
    <label className="control control-slider" htmlFor={id}>
      <span className="control-row">
        <span>{label}</span>
        <strong>{Math.round(value)}</strong>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {(leftLabel || rightLabel) && (
        <span className="range-labels" aria-hidden="true">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </span>
      )}
    </label>
  );
}
