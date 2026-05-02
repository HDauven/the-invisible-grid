export type PlantId =
  | "nuclear"
  | "coal"
  | "ccgt"
  | "peaker"
  | "solar"
  | "wind"
  | "battery"
  | "demand"
  | "grid";

export type PlantProfile = {
  id: PlantId;
  name: string;
  description: string;
  traits: {
    buildTime: number;
    flexibility: number;
    stability: number;
    emissionsFuel: number;
    financingRisk: number;
  };
  helps: string;
  limitation: string;
  costNote: string;
  behavior:
    | "baseload"
    | "slow"
    | "ramp"
    | "peak"
    | "solar"
    | "wind"
    | "storage"
    | "demand"
    | "grid";
};

export const plantProfiles: PlantProfile[] = [
  {
    id: "nuclear",
    name: "Nuclear",
    description: "Firm low-carbon output with high upfront capital and financing sensitivity.",
    traits: { buildTime: 5, flexibility: 2, stability: 5, emissionsFuel: 1, financingRisk: 5 },
    helps: "Provides a steady block through the whole day.",
    limitation: "Does not cheaply solve short, sharp peaks by itself.",
    costNote: "Capital cost per MWh is highly sensitive to build time and financing.",
    behavior: "baseload"
  },
  {
    id: "coal",
    name: "Coal",
    description: "Dispatchable synchronous generation, but slow to cycle and high-emissions.",
    traits: { buildTime: 3, flexibility: 2, stability: 4, emissionsFuel: 5, financingRisk: 3 },
    helps: "Covers sustained demand when running.",
    limitation: "Adds emissions and is poorly suited to fast cycling.",
    costNote: "System cost includes fuel, emissions exposure, and cycling limits.",
    behavior: "slow"
  },
  {
    id: "ccgt",
    name: "CCGT gas",
    description: "Efficient gas generation that can follow ramps, with fuel-price exposure.",
    traits: { buildTime: 2, flexibility: 4, stability: 3, emissionsFuel: 4, financingRisk: 2 },
    helps: "Follows the evening ramp and medium-duration gaps.",
    limitation: "Still carries fuel and CO2 exposure.",
    costNote: "Low capex can be offset by fuel and emissions price risk.",
    behavior: "ramp"
  },
  {
    id: "peaker",
    name: "Peaker gas",
    description: "Fast response for short stress periods, expensive and emissions-intensive per MWh.",
    traits: { buildTime: 1, flexibility: 5, stability: 2, emissionsFuel: 5, financingRisk: 1 },
    helps: "Covers short peaks when the system is stressed.",
    limitation: "Too expensive and polluting to run constantly.",
    costNote: "Useful capacity can matter more than low energy cost.",
    behavior: "peak"
  },
  {
    id: "solar",
    name: "Solar",
    description: "Cheap daytime electricity with a weather-shaped midday profile.",
    traits: { buildTime: 1, flexibility: 1, stability: 1, emissionsFuel: 0, financingRisk: 1 },
    helps: "Reduces daytime demand from other sources.",
    limitation: "Does not directly cover evening or night demand.",
    costNote: "Cheap plant cost can still need storage, grid, or curtailment management.",
    behavior: "solar"
  },
  {
    id: "wind",
    name: "Wind",
    description: "Clean weather-shaped energy that often needs transmission and balancing support.",
    traits: { buildTime: 2, flexibility: 1, stability: 1, emissionsFuel: 0, financingRisk: 2 },
    helps: "Adds clean energy when weather conditions line up.",
    limitation: "Its value depends on weather, location, and the rest of the system.",
    costNote: "Transmission, balancing, and weather timing shape system value.",
    behavior: "wind"
  },
  {
    id: "battery",
    name: "Battery",
    description: "Very fast storage for short-duration shifting, response, and local relief.",
    traits: { buildTime: 1, flexibility: 5, stability: 4, emissionsFuel: 0, financingRisk: 2 },
    helps: "Charges when supply is abundant and discharges during peaks.",
    limitation: "Limited by power rating, duration, charge state, and location.",
    costNote: "Value depends on cycles, duration, and the local constraint it solves.",
    behavior: "storage"
  },
  {
    id: "demand",
    name: "Demand response",
    description: "Flexible demand that can shift or reduce load when coordinated well.",
    traits: { buildTime: 1, flexibility: 4, stability: 3, emissionsFuel: 0, financingRisk: 1 },
    helps: "Softens peaks by moving some demand away from stress hours.",
    limitation: "Limited by user tolerance and coordination.",
    costNote: "Often cheap when available, but not unlimited.",
    behavior: "demand"
  },
  {
    id: "grid",
    name: "Grid upgrade",
    description: "More network capacity that unlocks generation and demand in constrained places.",
    traits: { buildTime: 4, flexibility: 0, stability: 3, emissionsFuel: 0, financingRisk: 3 },
    helps: "Raises the amount of power that can move through a bottleneck.",
    limitation: "Slow, site-specific, and does not generate electricity.",
    costNote: "Can lower system cost by unlocking generation and demand that already exist.",
    behavior: "grid"
  }
];
