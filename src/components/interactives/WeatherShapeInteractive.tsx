"use client";

import { CloudSun } from "lucide-react";
import { useMemo, useState } from "react";
import { HOURS } from "@/lib/model/curve";
import {
  weatherScenarios,
  weatherState,
  type WeatherScenarioId
} from "@/lib/model/weather";
import { ToggleGroup } from "@/components/ui/ToggleGroup";

const width = 760;
const height = 420;
const margin = { top: 30, right: 34, bottom: 42, left: 42 };

function scale(domain: [number, number], range: [number, number]) {
  const [domainMin, domainMax] = domain;
  const [rangeMin, rangeMax] = range;
  return (value: number) => rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
}

function path(values: number[], yDomain: [number, number]) {
  const x = scale([0, 24], [margin.left, width - margin.right]);
  const y = scale(yDomain, [height - margin.bottom, margin.top]);

  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${x(HOURS[index]).toFixed(2)} ${y(value).toFixed(2)}`)
    .join(" ");
}

function area(values: number[], yDomain: [number, number]) {
  const x = scale([0, 24], [margin.left, width - margin.right]);
  const y = scale(yDomain, [height - margin.bottom, margin.top]);
  const top = values.map((value, index) => `${index === 0 ? "M" : "L"} ${x(HOURS[index]).toFixed(2)} ${y(value).toFixed(2)}`);

  return [...top, `L ${x(24)} ${y(0)}`, `L ${x(0)} ${y(0)}`, "Z"].join(" ");
}

export function WeatherShapeInteractive() {
  const [scenario, setScenario] = useState<WeatherScenarioId>("cloudyWindy");
  const selected = weatherScenarios.find((item) => item.id === scenario) ?? weatherScenarios[0];
  const state = useMemo(() => weatherState(scenario), [scenario]);
  const yDomain: [number, number] = [-20, 120];
  const x = scale([0, 24], [margin.left, width - margin.right]);
  const y = scale(yDomain, [height - margin.bottom, margin.top]);
  const stressIndex = state.netLoad.reduce(
    (best, value, index) => (value > state.netLoad[best] ? index : best),
    0
  );

  return (
    <div className="interactive chart-panel weather-panel">
      <div className="panel-heading">
        <span>
          <CloudSun aria-hidden="true" size={18} />
          Weather shape
        </span>
        <strong>{selected.stress}</strong>
      </div>

      <figure aria-labelledby="weather-summary">
        <svg className="weather-chart detail-svg" viewBox={`0 0 ${width} ${height}`} role="img">
          {[0, 25, 50, 75, 100].map((tick) => (
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

          <path className="solar-area" d={area(state.solar, yDomain)} />
          <path className="wind-area" d={area(state.wind, yDomain)} />
          <path className="demand-line morph-line" d={path(state.demand, yDomain)} />
          <path className="solar-line morph-line" d={path(state.solar, yDomain)} />
          <path className="wind-line morph-line" d={path(state.wind, yDomain)} />
          <path className="net-line morph-line" d={path(state.netLoad, yDomain)} />

          <line
            className="ramp-marker"
            x1={x(HOURS[stressIndex])}
            x2={x(HOURS[stressIndex])}
            y1={y(state.netLoad[stressIndex])}
            y2={y(0)}
          />
          <text className="annotation strong chart-callout" x={x(Math.max(1.5, HOURS[stressIndex] - 3.1))} y={y(state.netLoad[stressIndex]) - 18}>
            {selected.stress}
          </text>
          <text className="direct-label demand" x={x(2.2)} y={y(state.demand[10]) - 10}>
            demand
          </text>
          <text className="direct-label solar" x={x(11.2)} y={y(Math.max(12, state.solar[44])) - 12}>
            solar
          </text>
          <text className="direct-label wind" x={x(15)} y={y(Math.max(12, state.wind[60])) - 10}>
            wind
          </text>
          <text className="direct-label net" x={x(20.2)} y={y(state.netLoad[82]) + 22}>
            net load
          </text>
        </svg>
        <figcaption id="weather-summary">{selected.summary}</figcaption>
      </figure>

      <ToggleGroup
        label="Weather scenario"
        value={scenario}
        options={weatherScenarios.map((item) => ({ value: item.id, label: item.label }))}
        onChange={setScenario}
      />
    </div>
  );
}
