import { HOURS, clamp, maxIndex, sum } from "./curve";
import { demandProfile } from "./demand";

export type SolarDuckState = {
  demand: number[];
  solar: number[];
  netLoad: number[];
  curtailment: number[];
  rampIndex: number;
  curtailmentTotal: number;
  eveningRamp: number;
};

function daylight(hour: number) {
  const sunrise = 6;
  const sunset = 20;

  if (hour < sunrise || hour > sunset) {
    return 0;
  }

  const x = (hour - sunrise) / (sunset - sunrise);
  return Math.pow(Math.sin(Math.PI * x), 1.7);
}

export function solarProfile(buildout: number) {
  const capacity = 18 + buildout * 0.94;
  return HOURS.map((hour) => capacity * daylight(hour));
}

export function solarDuckState(buildout: number): SolarDuckState {
  const demand = demandProfile();
  const solar = solarProfile(buildout);
  const exportAndFlexCapacity = 8 + (100 - buildout) * 0.04;

  const curtailment = solar.map((available, index) => {
    const usable = Math.min(available, demand[index] + exportAndFlexCapacity);
    return Math.max(0, available - usable);
  });

  const netLoad = demand.map((load, index) => {
    const usableSolar = solar[index] - curtailment[index];
    return load - usableSolar;
  });

  const ramps = netLoad.map((load, index) => {
    if (index === 0) {
      return 0;
    }
    return load - netLoad[index - 1];
  });

  const eveningStart = Math.floor(15 * 4);
  const eveningRamps = ramps.slice(eveningStart);
  const rampIndex = maxIndex(eveningRamps) + eveningStart;

  return {
    demand,
    solar,
    netLoad: netLoad.map((value) => clamp(value, -18, 110)),
    curtailment,
    rampIndex,
    curtailmentTotal: sum(curtailment) / 4,
    eveningRamp: ramps[rampIndex] * 4
  };
}
