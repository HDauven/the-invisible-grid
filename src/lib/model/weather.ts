import { HOURS, bump, clamp } from "./curve";
import { demandProfile } from "./demand";
import { solarProfile } from "./solar";

export type WeatherScenarioId =
  | "sunnyCalm"
  | "cloudyWindy"
  | "coldStill"
  | "stormyNight"
  | "dunkelflaute";

export type WeatherScenario = {
  id: WeatherScenarioId;
  label: string;
  summary: string;
  stress: string;
};

export const weatherScenarios: WeatherScenario[] = [
  {
    id: "sunnyCalm",
    label: "Sunny calm day",
    summary:
      "Solar helps strongly around noon, but the evening still needs storage, imports, demand response, or dispatchable power.",
    stress: "Evening flexibility matters"
  },
  {
    id: "cloudyWindy",
    label: "Cloudy windy day",
    summary:
      "Wind carries more of the system while clouds reduce solar. The net load is lower but still changes through the day.",
    stress: "Wind helps cover demand"
  },
  {
    id: "coldStill",
    label: "Cold still evening",
    summary:
      "Demand rises into the evening while wind and solar are low, so firm capacity and flexible response matter.",
    stress: "Firm backup is needed"
  },
  {
    id: "stormyNight",
    label: "Stormy night",
    summary:
      "Wind can be abundant when demand is lower. Storage, exports, or flexible demand help make that energy useful.",
    stress: "Move surplus into value"
  },
  {
    id: "dunkelflaute",
    label: "Dunkelflaute",
    summary:
      "Low wind and low solar for many hours means the system needs firm backup, imports, stored energy, or demand reduction.",
    stress: "Low renewable output"
  }
];

function smoothWind(hour: number, scenario: WeatherScenarioId) {
  if (scenario === "cloudyWindy") {
    return 30 + bump(hour, 8, 4.8, 8) + bump(hour, 18, 5.2, 12);
  }

  if (scenario === "coldStill") {
    return 7 + bump(hour, 3, 3.5, 4) + bump(hour, 23, 2.5, 3);
  }

  if (scenario === "stormyNight") {
    return 16 + bump(hour, 2.5, 3.8, 34) + bump(hour, 22, 3.0, 24);
  }

  if (scenario === "dunkelflaute") {
    return 5 + bump(hour, 15, 5.5, 3);
  }

  return 9 + bump(hour, 5, 3.2, 5) + bump(hour, 15.5, 5.0, 4);
}

export function weatherState(scenario: WeatherScenarioId) {
  const scenarioDemand = scenario === "coldStill" || scenario === "dunkelflaute" ? "winter" : "workday";
  const demand = demandProfile(scenarioDemand);
  const solarBuildout = scenario === "cloudyWindy" ? 24 : scenario === "dunkelflaute" ? 14 : scenario === "stormyNight" ? 18 : 58;
  const solar = solarProfile(solarBuildout).map((value) => {
    if (scenario === "cloudyWindy") {
      return value * 0.45;
    }
    if (scenario === "coldStill") {
      return value * 0.28;
    }
    if (scenario === "stormyNight") {
      return value * 0.35;
    }
    if (scenario === "dunkelflaute") {
      return value * 0.18;
    }
    return value;
  });
  const wind = HOURS.map((hour) => clamp(smoothWind(hour, scenario), 0, 70));
  const netLoad = demand.map((value, index) => clamp(value - solar[index] - wind[index], -20, 115));

  return { demand, solar, wind, netLoad };
}
