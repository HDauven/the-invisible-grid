export type SystemValueId = "solar" | "wind" | "nuclear" | "gas" | "battery" | "grid" | "demand";

export type SystemValueProfile = {
  id: SystemValueId;
  name: string;
  plantCost: {
    construction: number;
    fuel: number;
    maintenance: number;
  };
  systemEffects: {
    timing: number;
    location: number;
    flexibility: number;
    firmCapacity: number;
    reserves: number;
    stability: number;
    curtailment: number;
    gridUpgrades: number;
    fuelRisk: number;
    financingRisk: number;
  };
  summary: string;
};

export const systemValueProfiles: SystemValueProfile[] = [
  {
    id: "solar",
    name: "Solar",
    plantCost: { construction: 2, fuel: 0, maintenance: 1 },
    systemEffects: {
      timing: 5,
      location: 3,
      flexibility: 4,
      firmCapacity: 4,
      reserves: 2,
      stability: 2,
      curtailment: 4,
      gridUpgrades: 3,
      fuelRisk: 0,
      financingRisk: 1
    },
    summary:
      "Low plant cost can be very valuable, but timing, curtailment, storage, and grid location shape system value."
  },
  {
    id: "wind",
    name: "Wind",
    plantCost: { construction: 3, fuel: 0, maintenance: 2 },
    systemEffects: {
      timing: 4,
      location: 4,
      flexibility: 4,
      firmCapacity: 4,
      reserves: 3,
      stability: 2,
      curtailment: 3,
      gridUpgrades: 4,
      fuelRisk: 0,
      financingRisk: 2
    },
    summary:
      "Wind can provide large amounts of clean energy, but weather timing and transmission are central to its value."
  },
  {
    id: "nuclear",
    name: "Nuclear",
    plantCost: { construction: 5, fuel: 1, maintenance: 3 },
    systemEffects: {
      timing: 1,
      location: 2,
      flexibility: 2,
      firmCapacity: 1,
      reserves: 1,
      stability: 1,
      curtailment: 1,
      gridUpgrades: 2,
      fuelRisk: 1,
      financingRisk: 5
    },
    summary:
      "High upfront cost and financing risk sit alongside firm low-carbon output, high capacity factor, and stability value."
  },
  {
    id: "gas",
    name: "Gas",
    plantCost: { construction: 2, fuel: 5, maintenance: 2 },
    systemEffects: {
      timing: 1,
      location: 2,
      flexibility: 1,
      firmCapacity: 1,
      reserves: 1,
      stability: 2,
      curtailment: 0,
      gridUpgrades: 1,
      fuelRisk: 5,
      financingRisk: 1
    },
    summary:
      "Flexible gas can reduce reliability risk, but the system carries fuel-price and emissions exposure."
  },
  {
    id: "battery",
    name: "Battery",
    plantCost: { construction: 3, fuel: 0, maintenance: 1 },
    systemEffects: {
      timing: 1,
      location: 4,
      flexibility: 0,
      firmCapacity: 3,
      reserves: 0,
      stability: 1,
      curtailment: 1,
      gridUpgrades: 2,
      fuelRisk: 0,
      financingRisk: 2
    },
    summary:
      "A battery is not a generator. Its value depends on duration, power rating, cycles, state of charge, and location."
  },
  {
    id: "grid",
    name: "Grid upgrade",
    plantCost: { construction: 4, fuel: 0, maintenance: 2 },
    systemEffects: {
      timing: 1,
      location: 0,
      flexibility: 2,
      firmCapacity: 2,
      reserves: 2,
      stability: 2,
      curtailment: 1,
      gridUpgrades: 0,
      fuelRisk: 0,
      financingRisk: 3
    },
    summary:
      "Grid upgrades do not produce energy, but they can unlock cheaper generation and demand that the system already has."
  },
  {
    id: "demand",
    name: "Demand response",
    plantCost: { construction: 1, fuel: 0, maintenance: 1 },
    systemEffects: {
      timing: 1,
      location: 2,
      flexibility: 0,
      firmCapacity: 2,
      reserves: 1,
      stability: 2,
      curtailment: 1,
      gridUpgrades: 1,
      fuelRisk: 0,
      financingRisk: 1
    },
    summary:
      "Flexible demand can be cheap and fast, but it is limited by user tolerance, coordination, and process constraints."
  }
];
