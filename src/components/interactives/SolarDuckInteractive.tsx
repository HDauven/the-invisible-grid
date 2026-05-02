"use client";

import { scaleLinear } from "d3-scale";
import { SunMedium } from "lucide-react";
import { useMemo, useState } from "react";
import { HOURS } from "@/lib/model/curve";
import { solarDuckState } from "@/lib/model/solar";
import { formatOne } from "@/lib/format/numbers";
import { Slider } from "@/components/ui/Slider";

const width = 760;
const height = 420;
const margin = { top: 30, right: 34, bottom: 42, left: 42 };

function linePath(values: number[], yDomain: [number, number]) {
  const x = scaleLinear().domain([0, 24]).range([margin.left, width - margin.right]);
  const y = scaleLinear().domain(yDomain).range([height - margin.bottom, margin.top]);

  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${x(HOURS[index])} ${y(value)}`)
    .join(" ");
}

function curtailmentPath(curtailment: number[], solar: number[], yDomain: [number, number]) {
  const x = scaleLinear().domain([0, 24]).range([margin.left, width - margin.right]);
  const y = scaleLinear().domain(yDomain).range([height - margin.bottom, margin.top]);

  const top = solar.map((value, index) => ({
    x: x(HOURS[index]),
    y: y(value)
  }));
  const bottom = solar.map((value, index) => ({
    x: x(HOURS[index]),
    y: y(value - curtailment[index])
  }));

  return [
    ...top.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`),
    ...bottom.reverse().map((point) => `L ${point.x} ${point.y}`),
    "Z"
  ].join(" ");
}

export function SolarDuckInteractive() {
  const [buildout, setBuildout] = useState(58);
  const state = useMemo(() => solarDuckState(buildout), [buildout]);
  const yDomain: [number, number] = [-18, 116];
  const x = scaleLinear().domain([0, 24]).range([margin.left, width - margin.right]);
  const y = scaleLinear().domain(yDomain).range([height - margin.bottom, margin.top]);
  const rampHour = HOURS[state.rampIndex];
  const rampY = y(state.netLoad[state.rampIndex]);
  const solarPeak = Math.max(...state.solar);
  const curtailmentVisible = state.curtailmentTotal > 0.8;

  return (
    <div className="interactive chart-panel">
      <div className="panel-heading">
        <span>
          <SunMedium aria-hidden="true" size={18} />
          Solar buildout
        </span>
        <strong>{curtailmentVisible ? `${formatOne(state.curtailmentTotal)} units curtailed` : "little curtailment"}</strong>
      </div>

      <figure aria-labelledby="solar-summary">
        <svg className="duck-chart" viewBox={`0 0 ${width} ${height}`} role="img">
          <defs>
            <pattern id="curtailmentHatch" patternUnits="userSpaceOnUse" width="8" height="8">
              <path d="M-1 9 L9 -1" stroke="#c16938" strokeWidth="1.4" opacity="0.7" />
            </pattern>
          </defs>

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

          {curtailmentVisible && (
            <path
              className="curtailment-area"
              d={curtailmentPath(state.curtailment, state.solar, yDomain)}
            />
          )}

          <path className="demand-line" d={linePath(state.demand, yDomain)} />
          <path className="solar-line" d={linePath(state.solar, yDomain)} />
          <path className="net-line" d={linePath(state.netLoad, yDomain)} />

          <line className="ramp-marker" x1={x(rampHour)} x2={x(rampHour)} y1={rampY} y2={y(84)} />
          <text className="annotation strong" x={x(rampHour) + 10} y={Math.min(rampY, y(86)) - 12}>
            Evening ramp
          </text>
          <text className="annotation" x={x(12.2)} y={y(Math.min(solarPeak + 8, 104))}>
            Solar helps most here
          </text>
          {curtailmentVisible && (
            <>
              <text className="annotation warning" x={x(11)} y={y(solarPeak - 12)}>
                Midday surplus
              </text>
              <text className="annotation warning" x={x(13.2)} y={y(solarPeak - 24)}>
                Curtailment
              </text>
            </>
          )}
          <text className="annotation" x={x(20.1)} y={y(74)}>
            Still need power here
          </text>
          <text className="direct-label demand" x={x(3)} y={y(state.demand[12]) - 10}>
            demand
          </text>
          <text className="direct-label solar" x={x(7.4)} y={y(26)}>
            solar
          </text>
          <text className="direct-label net" x={x(2.4)} y={y(state.netLoad[10]) + 20}>
            net load
          </text>
        </svg>
        <figcaption id="solar-summary">
          With solar buildout at {Math.round(buildout)}, daytime net load falls. At high buildout,
          midday surplus appears while the evening still needs flexible power after sunset.
        </figcaption>
      </figure>

      <Slider
        id="solar-buildout"
        label="Solar buildout"
        value={buildout}
        min={10}
        max={100}
        leftLabel="low"
        rightLabel="high"
        onChange={setBuildout}
      />
    </div>
  );
}
