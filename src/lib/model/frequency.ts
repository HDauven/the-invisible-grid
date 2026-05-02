import { clamp } from "./curve";

export type InertiaMode = "high" | "low";

export function targetFrequency(demandRise: number, response: boolean) {
  const baseDemand = 62;
  const demand = baseDemand + demandRise * 0.42;
  const generation = baseDemand + (response ? demandRise * 0.38 : demandRise * 0.08);
  const imbalance = generation - demand;
  return clamp(50 + imbalance * 0.018, 49.5, 50.5);
}

export function frequencyStatus(frequency: number) {
  if (frequency < 49.86) {
    return "Demand is outrunning supply.";
  }

  if (frequency > 50.14) {
    return "Supply is outrunning demand.";
  }

  return "Supply and demand are close enough for this simplified view.";
}
