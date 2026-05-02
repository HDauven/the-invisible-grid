"use client";

import { Landmark, TimerReset } from "lucide-react";
import { useMemo, useState } from "react";
import { nuclearFinance } from "@/lib/model/nuclearFinance";
import { formatOne } from "@/lib/format/numbers";
import { Slider } from "@/components/ui/Slider";

const width = 760;
const height = 380;

function money(value: number) {
  return `${formatOne(value / 1000)}bn`;
}

function eurPerMWh(value: number) {
  return `${formatOne(value * 1_000_000)} EUR/MWh`;
}

function centsPerKWh(value: number) {
  return `${formatOne(value * 1_000)} EUR/kWh`;
}

export function NuclearFinancingInteractive() {
  const [buildYears, setBuildYears] = useState(9);
  const [interestRate, setInterestRate] = useState(5);
  const [delayYears, setDelayYears] = useState(1);
  const result = useMemo(
    () => nuclearFinance({ buildYears, interestRate, delayYears }),
    [buildYears, interestRate, delayYears]
  );
  const reference = useMemo(
    () => nuclearFinance({ buildYears: 6, interestRate: 2, delayYears: 0 }),
    []
  );

  const maxCost = Math.max(result.financedCost, result.overnightCost) * 1.12;
  const overnightWidth = (result.overnightCost / maxCost) * 100;
  const financedWidth = (result.financedCost / maxCost) * 100;
  const timelineMax = Math.max(...result.yearlySpend.map((item) => item.accumulated));
  const maxMWhCost = Math.max(result.capitalCostPerMWh, reference.capitalCostPerMWh) * 1.18;
  const currentMWhWidth = (result.capitalCostPerMWh / maxMWhCost) * 100;
  const referenceMWhWidth = (reference.capitalCostPerMWh / maxMWhCost) * 100;
  const lifetimeTWh = result.lifetimeGenerationMWh / 1_000_000;
  const points = result.yearlySpend
    .map((item, index) => {
      const x = 48 + (index / Math.max(result.yearlySpend.length - 1, 1)) * (width - 96);
      const y = 310 - (item.accumulated / timelineMax) * 235;
      return `${x},${y}`;
    })
    .join(" ");
  const summary =
    delayYears > 0
      ? `Here, delay and interest lift the illustrative capital committed before operation from ${money(result.overnightCost)} to ${money(result.financedCost)}.`
      : `Here, interest during construction lifts the illustrative capital committed before operation from ${money(result.overnightCost)} to ${money(result.financedCost)}.`;

  return (
    <div className="interactive nuclear-panel">
      <div className="panel-heading">
        <span>
          <Landmark aria-hidden="true" size={18} />
          Financing sensitivity
        </span>
        <strong>{money(result.financedCost)} before operation</strong>
      </div>

      <figure aria-labelledby="nuclear-summary">
        <svg className="finance-chart detail-svg" viewBox={`0 0 ${width} ${height}`} role="img">
          <text className="direct-label chart-callout" x="48" y="32">
            Money accumulates before first electricity is sold
          </text>
          <line className="axis-line" x1="48" x2={width - 48} y1="310" y2="310" />
          <polyline className="finance-line" points={points} />
          {result.yearlySpend.map((item, index) => {
            const x = 48 + (index / Math.max(result.yearlySpend.length - 1, 1)) * (width - 96);
            const y = 310 - (item.accumulated / timelineMax) * 235;
            return (
              <g key={item.year} className="finance-point" data-delay={item.isDelay}>
                <circle cx={x} cy={y} r={item.isDelay ? 5 : 4} />
                {(item.year === 1 || item.year === result.yearlySpend.length) && (
                  <text x={x} y="334" textAnchor="middle">
                    year {item.year}
                  </text>
                )}
              </g>
            );
          })}
          {delayYears > 0 && (
            <text className="annotation warning state-annotation chart-callout" x={width - 250} y="58">
              Delay years add cost before revenue
            </text>
          )}
          <text className="annotation chart-callout" x={width - 230} y="286">
            first electricity sold here
          </text>
        </svg>
        <figcaption id="nuclear-summary">
          {summary} This is an educational capital model, not a real project-finance
          forecast.
        </figcaption>
      </figure>

      <div className="finance-bars" aria-label="Illustrative cost comparison">
        <div>
          <span>Overnight construction cost</span>
          <strong>{money(result.overnightCost)}</strong>
          <i style={{ width: `${overnightWidth}%` }} />
        </div>
        <div>
          <span>Cost after financing and delay</span>
          <strong>{money(result.financedCost)}</strong>
          <i style={{ width: `${financedWidth}%` }} />
        </div>
      </div>

      <div className="kwh-panel" aria-label="Illustrative capital recovery pressure">
        <div className="kwh-intro">
          <span>Illustrative capital recovery index</span>
          <strong>{centsPerKWh(result.capitalCostPerMWh)}</strong>
          <p>
            Simplified EUR/kWh-style index for the same illustrative 1.2 GW reactor,
            {formatOne(lifetimeTWh)} TWh lifetime output. This is not a project cost
            estimate.
          </p>
        </div>
        <div className="kwh-bars">
          <div>
            <span>Illustrative reference: 6 years, 2%, no delay</span>
            <strong>{eurPerMWh(reference.capitalCostPerMWh)}</strong>
            <i style={{ width: `${referenceMWhWidth}%` }} />
          </div>
          <div>
            <span>Illustrative current slider setting</span>
            <strong>{eurPerMWh(result.capitalCostPerMWh)}</strong>
            <i style={{ width: `${currentMWhWidth}%` }} />
          </div>
        </div>
      </div>

      <div className="control-grid">
        <Slider
          id="nuclear-build-time"
          label="Build time"
          value={buildYears}
          min={6}
          max={14}
          leftLabel="6 years"
          rightLabel="14 years"
          onChange={setBuildYears}
        />
        <Slider
          id="nuclear-interest-rate"
          label="Interest rate"
          value={interestRate}
          min={2}
          max={10}
          leftLabel="2%"
          rightLabel="10%"
          onChange={setInterestRate}
        />
        <Slider
          id="nuclear-delay"
          label="Delay"
          value={delayYears}
          min={0}
          max={4}
          leftLabel="none"
          rightLabel="4 years"
          onChange={setDelayYears}
        />
      </div>

      <div className="provided-list">
        <details>
          <summary>
            <TimerReset aria-hidden="true" size={16} />
            After completion
          </summary>
          <ul>
            <li>firm low-carbon output</li>
            <li>high capacity factor</li>
            <li>low fuel-price exposure</li>
            <li>stability value</li>
            <li>long asset life</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
