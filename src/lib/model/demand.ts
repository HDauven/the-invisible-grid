import { HOURS, bump } from "./curve";

export type DemandScenarioId =
  | "workday"
  | "weekend"
  | "winter"
  | "summer"
  | "ev";

export type DemandScenario = {
  id: DemandScenarioId;
  label: string;
  summary: string;
};

export const demandScenarios: DemandScenario[] = [
  {
    id: "workday",
    label: "Workday",
    summary:
      "A normal workday has a night low, a morning ramp, steady daytime activity, and an evening peak."
  },
  {
    id: "weekend",
    label: "Weekend",
    summary:
      "Weekend demand starts later and the evening peak is softer, but the day still has a shape."
  },
  {
    id: "winter",
    label: "Winter evening",
    summary:
      "Cold evenings push demand higher after sunset, when lighting, heating, and cooking overlap."
  },
  {
    id: "summer",
    label: "Summer afternoon",
    summary:
      "Hot afternoons can move the peak earlier as cooling demand rises while the sun is still high."
  },
  {
    id: "ev",
    label: "EV-heavy evening",
    summary:
      "Unmanaged charging can add a second evening lift just as the rest of demand is already high."
  }
];

export function demandProfile(scenario: DemandScenarioId = "workday") {
  return HOURS.map((hour) => {
    if (scenario === "weekend") {
      return (
        46 +
        bump(hour, 10.2, 2.3, 12) +
        bump(hour, 14.8, 4.8, 14) +
        bump(hour, 20.2, 2.4, 22)
      );
    }

    if (scenario === "winter") {
      return (
        54 +
        bump(hour, 7.7, 1.8, 16) +
        bump(hour, 13.2, 4.8, 11) +
        bump(hour, 18.5, 2.2, 42) +
        bump(hour, 22.0, 2.0, 9)
      );
    }

    if (scenario === "summer") {
      return (
        48 +
        bump(hour, 8.4, 1.8, 11) +
        bump(hour, 15.6, 3.4, 37) +
        bump(hour, 20.4, 2.0, 16)
      );
    }

    if (scenario === "ev") {
      return (
        48 +
        bump(hour, 8.1, 1.7, 15) +
        bump(hour, 13.5, 4.5, 17) +
        bump(hour, 19.2, 2.0, 30) +
        bump(hour, 21.3, 1.3, 19)
      );
    }

    return (
      48 +
      bump(hour, 8.1, 1.7, 17) +
      bump(hour, 13.5, 4.5, 18) +
      bump(hour, 19.2, 2.0, 32) +
      bump(hour, 22.5, 1.8, 6)
    );
  });
}
