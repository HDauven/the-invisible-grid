import { HOURS, bump } from "./curve";
import { demandProfile } from "./demand";
import type { PlantProfile } from "@/data/plantProfiles";

export type PlantBehaviorState = {
  demand: number[];
  highlight: number[];
};

function daylight(hour: number) {
  if (hour < 6 || hour > 20) {
    return 0;
  }

  const x = (hour - 6) / 14;
  return Math.pow(Math.sin(Math.PI * x), 1.65);
}

export function plantBehavior(profile: PlantProfile): PlantBehaviorState {
  const demand = demandProfile();

  const highlight = HOURS.map((hour, index) => {
    switch (profile.behavior) {
      case "baseload":
        return 58;
      case "slow":
        return 48 + bump(hour, 12, 6, 10);
      case "ramp":
        return Math.max(0, demand[index] - 54) * 0.72;
      case "peak":
        return bump(hour, 19.2, 1.15, 34);
      case "solar":
        return daylight(hour) * 72;
      case "wind":
        return 28 + bump(hour, 2, 2.5, 18) + bump(hour, 15.5, 4.5, 14);
      case "storage":
        return bump(hour, 20, 1.5, 32) - bump(hour, 13, 2.2, 18);
      case "demand":
        return -bump(hour, 19, 1.5, 20);
      case "grid":
        return 72;
    }
  });

  return { demand, highlight };
}
