"use client";

import { Activity } from "lucide-react";
import { useMemo, useState } from "react";
import {
  demandProfile,
  demandScenarios,
  type DemandScenarioId
} from "@/lib/model/demand";
import { HOURS } from "@/lib/model/curve";
import { ToggleGroup } from "@/components/ui/ToggleGroup";

const width = 760;
const height = 360;
const margin = { top: 28, right: 34, bottom: 42, left: 42 };

function scale(domain: [number, number], range: [number, number]) {
  const [domainMin, domainMax] = domain;
  const [rangeMin, rangeMax] = range;
  return (value: number) => rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
}

function linePath(values: number[]) {
  const x = scale([0, 24], [margin.left, width - margin.right]);
  const y = scale([35, 112], [height - margin.bottom, margin.top]);

  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${x(HOURS[index]).toFixed(2)} ${y(value).toFixed(2)}`)
    .join(" ");
}

export function DailyDemandInteractive() {
  const [scenario, setScenario] = useState<DemandScenarioId>("workday");
  const selected = demandScenarios.find((item) => item.id === scenario) ?? demandScenarios[0];
  const demand = useMemo(() => demandProfile(scenario), [scenario]);
  const x = scale([0, 24], [margin.left, width - margin.right]);
  const y = scale([35, 112], [height - margin.bottom, margin.top]);
  const peak = demand.reduce(
    (best, value, index) => (value > best.value ? { value, index } : best),
    { value: 0, index: 0 }
  );

  return (
    <div className="interactive chart-panel demand-panel">
      <div className="panel-heading">
        <span>
          <Activity aria-hidden="true" size={18} />
          Demand shape
        </span>
        <strong>{selected.label}</strong>
      </div>

      <figure aria-labelledby="daily-demand-summary">
        <svg className="demand-chart detail-svg" viewBox={`0 0 ${width} ${height}`} role="img">
          {[50, 75, 100].map((tick) => (
            <g key={tick}>
              <line className="gridline" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
              <text className="axis-label" x={margin.left - 10} y={y(tick) + 4} textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
          {[0, 6, 12, 18, 24].map((tick) => (
            <text key={tick} className="axis-label" x={x(tick)} y={height - 12} textAnchor="middle">
              {tick === 24 ? "24h" : `${tick}:00`}
            </text>
          ))}

          <path className="demand-area" d={`${linePath(demand)} L ${x(24)} ${y(35)} L ${x(0)} ${y(35)} Z`} />
          <path className="demand-line morph-line" d={linePath(demand)} />
          <circle className="chart-dot" cx={x(HOURS[peak.index])} cy={y(peak.value)} r="5" />

          <text className="annotation chart-callout" x={x(2.0)} y={y(demand[8]) - 18}>
            Night low
          </text>
          <text className="annotation chart-callout" x={x(7.3)} y={y(demand[30]) - 20}>
            Morning ramp
          </text>
          <text className="annotation chart-callout" x={x(12.4)} y={y(demand[50]) - 24}>
            Daytime activity
          </text>
          <text className="annotation strong chart-callout" x={x(Math.min(21, HOURS[peak.index] - 1.8))} y={y(peak.value) - 20}>
            Evening peak
          </text>
          <text className="annotation chart-callout" x={x(20.8)} y={y(demand[88]) + 30}>
            Late-night decline
          </text>
        </svg>
        <figcaption id="daily-demand-summary">{selected.summary}</figcaption>
      </figure>

      <ToggleGroup
        label="Day type"
        value={scenario}
        options={demandScenarios.map((item) => ({ value: item.id, label: item.label }))}
        onChange={setScenario}
      />
    </div>
  );
}
