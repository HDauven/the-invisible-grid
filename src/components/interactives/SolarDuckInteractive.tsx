"use client";

import { SunMedium } from "lucide-react";
import { useMemo, useState } from "react";
import { HOURS } from "@/lib/model/curve";
import { solarDuckState } from "@/lib/model/solar";
import { formatOne } from "@/lib/format/numbers";
import { Slider } from "@/components/ui/Slider";

const width = 760;
const height = 420;
const margin = { top: 30, right: 34, bottom: 42, left: 42 };

function rounded(value: number) {
  return Math.round(value * 1000) / 1000;
}

function createScale(domain: [number, number], range: [number, number]) {
  const [domainMin, domainMax] = domain;
  const [rangeMin, rangeMax] = range;

  return (value: number) => {
    const t = (value - domainMin) / (domainMax - domainMin);
    return rounded(rangeMin + t * (rangeMax - rangeMin));
  };
}

function linePath(values: number[], yDomain: [number, number]) {
  const x = createScale([0, 24], [margin.left, width - margin.right]);
  const y = createScale(yDomain, [height - margin.bottom, margin.top]);

  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${x(HOURS[index])} ${y(value)}`)
    .join(" ");
}

function curtailmentPath(curtailment: number[], solar: number[], yDomain: [number, number]) {
  const x = createScale([0, 24], [margin.left, width - margin.right]);
  const y = createScale(yDomain, [height - margin.bottom, margin.top]);

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
  const x = createScale([0, 24], [margin.left, width - margin.right]);
  const y = createScale(yDomain, [height - margin.bottom, margin.top]);
  const rampHour = HOURS[state.rampIndex];
  const rampY = y(state.netLoad[state.rampIndex]);
  const curtailmentVisible = state.curtailmentTotal > 0.8;
  const rampVisible = state.eveningRamp > 11;
  const stateSummary = curtailmentVisible
    ? "At this buildout, solar cuts daytime demand from other sources, but noon surplus and curtailment appear before a steeper evening ramp."
    : "At this buildout, solar is mostly absorbed by daytime demand. The system still needs power after sunset.";

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

          <path className="demand-line morph-line" d={linePath(state.demand, yDomain)} />
          <path className="solar-line morph-line" d={linePath(state.solar, yDomain)} />
          <path className="net-line morph-line" d={linePath(state.netLoad, yDomain)} />

          {rampVisible && (
            <>
              <line className="ramp-marker" x1={x(rampHour)} x2={x(rampHour)} y1={rampY} y2={y(84)} />
              <text className="annotation strong state-annotation chart-callout" x={x(rampHour) - 92} y={70}>
                Evening ramp gets steeper
              </text>
            </>
          )}
          <text className="annotation chart-callout" x={x(9.2)} y={58}>
            Solar helps most here
          </text>
          {curtailmentVisible && (
            <>
              <text className="annotation warning chart-callout" x={x(9.2)} y={96}>
                Midday surplus appears
              </text>
              <text className="annotation warning chart-callout" x={x(13.6)} y={126}>
                Curtailment begins
              </text>
            </>
          )}
          <text className="annotation chart-callout" x={x(18.4)} y={175}>
            Still need power after sunset
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
          {stateSummary}
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
