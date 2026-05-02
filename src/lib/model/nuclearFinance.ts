export type NuclearFinanceInputs = {
  buildYears: number;
  interestRate: number;
  delayYears: number;
};

export type NuclearFinanceResult = {
  overnightCost: number;
  financedCost: number;
  interestDuringConstruction: number;
  delayCost: number;
  annualizedCapitalCost: number;
  capitalCostPerMWh: number;
  simpleLifetimeCapitalPerMWh: number;
  lifetimeGenerationMWh: number;
  yearlySpend: Array<{
    year: number;
    spend: number;
    accumulated: number;
    isDelay: boolean;
  }>;
};

const overnightCost = 10_000;
const delayCostPerYear = 700;
const lifetimeYears = 60;
const capacityMW = 1_200;
const capacityFactor = 0.88;

function capitalRecoveryFactor(rate: number, years: number) {
  if (rate === 0) {
    return 1 / years;
  }

  const growth = Math.pow(1 + rate, years);
  return (rate * growth) / (growth - 1);
}

export function nuclearFinance({
  buildYears,
  interestRate,
  delayYears
}: NuclearFinanceInputs): NuclearFinanceResult {
  const rate = interestRate / 100;
  const constructionYears = Math.round(buildYears);
  const delay = Math.round(delayYears);
  const annualSpend = overnightCost / constructionYears;
  let interestDuringConstruction = 0;
  let accumulated = 0;

  const yearlySpend = Array.from({ length: constructionYears + delay }, (_, index) => {
    const year = index + 1;
    const isDelay = index >= constructionYears;
    const spend = isDelay ? delayCostPerYear : annualSpend;
    const yearsUntilOperation = constructionYears - index + delay;
    const interest = isDelay ? 0 : spend * (Math.pow(1 + rate, yearsUntilOperation) - 1);

    interestDuringConstruction += interest;
    accumulated += spend + interest;

    return {
      year,
      spend,
      accumulated,
      isDelay
    };
  });

  const delayCost = delay * delayCostPerYear;
  const financedCost = overnightCost + interestDuringConstruction + delayCost;
  const annualizedCapitalCost = financedCost * capitalRecoveryFactor(rate, lifetimeYears);
  const annualMWh = capacityMW * capacityFactor * 8760;
  const lifetimeGenerationMWh = annualMWh * lifetimeYears;

  return {
    overnightCost,
    financedCost,
    interestDuringConstruction,
    delayCost,
    annualizedCapitalCost,
    capitalCostPerMWh: annualizedCapitalCost / annualMWh,
    simpleLifetimeCapitalPerMWh: financedCost / lifetimeGenerationMWh,
    lifetimeGenerationMWh,
    yearlySpend
  };
}
