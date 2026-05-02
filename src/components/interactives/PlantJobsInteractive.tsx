"use client";

import { Factory, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { plantProfiles, type PlantId } from "@/data/plantProfiles";
import { plantBehavior } from "@/lib/model/plantBehavior";
import { HOURS } from "@/lib/model/curve";

const width = 760;
const height = 350;
const margin = { top: 26, right: 24, bottom: 34, left: 34 };

const traitLabels = [
  ["buildTime", "Build time"],
  ["flexibility", "Flexibility"],
  ["stability", "Stability"],
  ["emissionsFuel", "Emissions/fuel exposure"],
  ["financingRisk", "Financing/capital risk"]
] as const;

function x(hour: number) {
  return margin.left + (hour / 24) * (width - margin.left - margin.right);
}

function y(value: number) {
  return height - margin.bottom - (value / 110) * (height - margin.top - margin.bottom);
}

function path(values: number[]) {
  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${x(HOURS[index])} ${y(value)}`)
    .join(" ");
}

function areaPath(values: number[]) {
  const top = values.map((value, index) => `${index === 0 ? "M" : "L"} ${x(HOURS[index])} ${y(Math.max(value, 0))}`);
  const bottom = values
    .map((value, index) => `L ${x(HOURS[index])} ${y(Math.min(value, 0))}`)
    .reverse();
  return [...top, ...bottom, "Z"].join(" ");
}

export function PlantJobsInteractive() {
  const [selectedId, setSelectedId] = useState<PlantId>("nuclear");
  const selected = plantProfiles.find((profile) => profile.id === selectedId) ?? plantProfiles[0];
  const state = useMemo(() => plantBehavior(selected), [selected]);

  return (
    <div className="interactive plant-panel">
      <div className="panel-heading">
        <span>
          <Factory aria-hidden="true" size={18} />
          Technology behavior
        </span>
        <strong>{selected.name}</strong>
      </div>

      <div className="plant-card-grid" aria-label="Technology cards">
        {plantProfiles.map((profile) => (
          <button
            key={profile.id}
            className="plant-card"
            data-active={profile.id === selectedId}
            type="button"
            aria-pressed={profile.id === selectedId}
            onClick={() => setSelectedId(profile.id)}
          >
            <span>{profile.name}</span>
            <small>{profile.description}</small>
          </button>
        ))}
      </div>

      <figure aria-labelledby="plant-summary">
        <svg className="plant-chart" viewBox={`0 0 ${width} ${height}`} role="img">
          {[0, 6, 12, 18, 24].map((tick) => (
            <text key={tick} className="axis-label" x={x(tick)} y={height - 10} textAnchor="middle">
              {tick === 24 ? "24h" : `${tick}:00`}
            </text>
          ))}
          {[25, 50, 75, 100].map((tick) => (
            <line key={tick} className="gridline" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
          ))}
          <path className="demand-line thin" d={path(state.demand)} />
          <path className="plant-help-area" data-kind={selected.behavior} d={areaPath(state.highlight)} />
          <path className="plant-help-line" d={path(state.highlight.map((value) => Math.max(value, 0)))} />
          <text className="direct-label demand" x={x(2.2)} y={y(state.demand[9]) - 8}>
            daily demand
          </text>
          <text className="annotation state-annotation chart-callout" x={x(10.8)} y={54}>
            {selected.helps}
          </text>
        </svg>
        <figcaption id="plant-summary">
          {selected.name}: {selected.helps} {selected.limitation}
        </figcaption>
      </figure>

      <p className="plant-cost-note">
        <strong>Cost lens:</strong> {selected.costNote}
      </p>

      <div className="trait-panel">
        <div className="trait-heading">
          <Info aria-hidden="true" size={16} />
          Visual teaching traits, not universal rankings
        </div>
        {traitLabels.map(([key, label]) => (
          <div className="trait-row" key={key}>
            <span>{label}</span>
            <i aria-label={`${label}: ${selected.traits[key]} out of 5`}>
              {Array.from({ length: 5 }, (_, index) => (
                <b key={index} data-filled={index < selected.traits[key]} />
              ))}
            </i>
          </div>
        ))}
      </div>
    </div>
  );
}
