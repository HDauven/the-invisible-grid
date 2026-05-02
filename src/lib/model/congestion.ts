export type BatteryPlacement = "solar" | "city" | "bottleneck";

export type GridNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "supply" | "demand" | "balance";
};

export type GridLine = {
  id: string;
  from: string;
  to: string;
  capacity: number;
  flow: number;
};

export type GridScenario = {
  nodes: GridNode[];
  lines: GridLine[];
  nationalGeneration: number;
  nationalDemand: number;
  surplus: number;
  curtailment: number;
  congestionRelief: number;
};

const nodes: GridNode[] = [
  { id: "offshore", label: "Offshore wind landing", x: 20, y: 20, kind: "supply" },
  { id: "solar", label: "Solar-heavy rural area", x: 24, y: 70, kind: "supply" },
  { id: "city", label: "City", x: 70, y: 43, kind: "demand" },
  { id: "industry", label: "Industrial cluster", x: 82, y: 70, kind: "demand" },
  { id: "gas", label: "Gas plant", x: 55, y: 84, kind: "balance" },
  { id: "nuclear", label: "Nuclear plant", x: 14, y: 45, kind: "balance" },
  { id: "interconnector", label: "Interconnector", x: 90, y: 24, kind: "balance" },
  { id: "substation", label: "Constrained substation", x: 50, y: 56, kind: "balance" }
];

const baseLines: GridLine[] = [
  { id: "offshore-city", from: "offshore", to: "city", capacity: 50, flow: 44 },
  { id: "solar-substation", from: "solar", to: "substation", capacity: 34, flow: 48 },
  { id: "substation-city", from: "substation", to: "city", capacity: 35, flow: 49 },
  { id: "nuclear-city", from: "nuclear", to: "city", capacity: 45, flow: 38 },
  { id: "gas-industry", from: "gas", to: "industry", capacity: 40, flow: 34 },
  { id: "city-industry", from: "city", to: "industry", capacity: 30, flow: 27 },
  { id: "interconnector-city", from: "interconnector", to: "city", capacity: 25, flow: 18 }
];

export function congestionScenario(placement: BatteryPlacement): GridScenario {
  const reliefByPlacement: Record<BatteryPlacement, number> = {
    solar: 7,
    city: 4,
    bottleneck: 16
  };

  const relief = reliefByPlacement[placement];

  const lines = baseLines.map((line) => {
    if (line.id === "solar-substation") {
      return { ...line, flow: line.flow - (placement === "solar" ? relief : placement === "bottleneck" ? relief * 0.9 : relief * 0.35) };
    }

    if (line.id === "substation-city") {
      return { ...line, flow: line.flow - relief };
    }

    return line;
  });

  return {
    nodes,
    lines,
    nationalGeneration: 174,
    nationalDemand: 166,
    surplus: 8,
    curtailment: placement === "bottleneck" ? 2 : placement === "solar" ? 4 : 7,
    congestionRelief: relief
  };
}

export function lineStress(line: GridLine) {
  const ratio = line.flow / line.capacity;

  if (ratio >= 1.05) {
    return "overloaded";
  }

  if (ratio >= 0.88) {
    return "near";
  }

  return "normal";
}
