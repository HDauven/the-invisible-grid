export const STEPS_PER_DAY = 96;
export const HOURS = Array.from({ length: STEPS_PER_DAY }, (_, index) => index / 4);

export function bump(hour: number, center: number, width: number, height: number) {
  return height * Math.exp(-Math.pow(hour - center, 2) / (2 * width * width));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function maxIndex(values: number[]) {
  return values.reduce((bestIndex, value, index, array) => {
    return value > array[bestIndex] ? index : bestIndex;
  }, 0);
}

export type SeriesPoint = {
  hour: number;
  value: number;
};

export function toSeries(values: number[]): SeriesPoint[] {
  return values.map((value, index) => ({ hour: HOURS[index], value }));
}
