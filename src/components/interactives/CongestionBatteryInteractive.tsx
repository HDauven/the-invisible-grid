"use client";

import { BatteryCharging, Map as MapIcon, Network } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { congestionScenario, type BatteryPlacement } from "@/lib/model/congestion";

type ViewMode = "national" | "grid";

const placementFeedback: Record<BatteryPlacement, string> = {
  none:
    "The solar-heavy area produces more than the local grid can move. The constrained corridor overloads and some energy is curtailed.",
  city:
    "The battery helps local peak demand, but the upstream corridor from the solar-heavy area remains overloaded.",
  solar:
    "The battery absorbs surplus near the source, reducing curtailment and easing the export path.",
  bottleneck:
    "The battery is placed where the constraint occurs, so it relieves the overloaded corridor most directly."
};

const criticalCapacity = 34;
const flowByPlacement: Record<BatteryPlacement, number> = {
  none: 48,
  city: 47,
  solar: 41,
  bottleneck: 34
};

const batteryPositions: Record<Exclude<BatteryPlacement, "none">, { x: number; y: number; label: string }> = {
  solar: { x: 25, y: 83, label: "Near solar" },
  bottleneck: { x: 50, y: 42, label: "At bottleneck" },
  city: { x: 73, y: 56, label: "Near city" }
};

const labelOffsets: Record<string, { x: number; y: number; anchor?: "start" | "middle" | "end" }> = {
  solar: { x: -4, y: -5, anchor: "end" },
  city: { x: 7, y: -6, anchor: "start" },
  substation: { x: 4, y: 10, anchor: "start" }
};

const shortNodeLabels: Record<string, string> = {
  offshore: "Offshore wind",
  solar: "Solar-heavy rural area",
  city: "City / industry",
  industry: "Industrial cluster",
  gas: "Gas plant",
  nuclear: "Nuclear plant",
  interconnector: "Interconnector",
  substation: "Constrained station"
};

const visibleNodeLabels = new Set(["solar", "city", "substation"]);

function mapXValue(value: number) {
  return 8 + value * 0.84;
}

function mapYValue(value: number) {
  return 8 + value * 0.8;
}

function mapX(value: number) {
  return `${mapXValue(value)}%`;
}

function mapY(value: number) {
  return `${mapYValue(value)}%`;
}

export function CongestionBatteryInteractive() {
  const [view, setView] = useState<ViewMode>("grid");
  const [placement, setPlacement] = useState<BatteryPlacement>("none");
  const scenario = useMemo(() => congestionScenario(placement), [placement]);
  const nodeById = new globalThis.Map(scenario.nodes.map((node) => [node.id, node]));
  const afterFlow = flowByPlacement[placement];
  const batteryEffect = scenario.congestionRelief;
  const remainingOverload = Math.max(0, afterFlow - criticalCapacity);
  const stateSummary = placementFeedback[placement];
  const status =
    remainingOverload <= 0
      ? "Bottleneck cleared"
      : batteryEffect > 0
        ? "Overload reduced, not solved"
        : "Bottleneck still overloaded";
  const corridorState = remainingOverload <= 0 ? "cleared" : batteryEffect > 0 ? "reduced" : "overloaded";

  return (
    <div className="interactive map-panel">
      <div className="panel-heading">
        <span>
          {view === "national" ? <MapIcon aria-hidden="true" size={18} /> : <Network aria-hidden="true" size={18} />}
          {view === "national" ? "National view" : "Grid view"}
        </span>
        <strong>
          {view === "national" ? (
            "Enough nationally"
          ) : (
            <>
              {status}
              <small>{batteryEffect} units relief</small>
            </>
          )}
        </strong>
      </div>

      <div className="map-grid">
        <figure className="grid-map" aria-labelledby="grid-summary">
          {view === "national" ? (
            <div className="national-reveal-card" aria-describedby="grid-summary">
              <div className="national-totals">
                <div>
                  <span>Total generation</span>
                  <strong>{scenario.nationalGeneration}</strong>
                </div>
                <div>
                  <span>Total demand</span>
                  <strong>{scenario.nationalDemand}</strong>
                </div>
              </div>
              <p>Looks fine nationally.</p>
              <p>But this view hides local wire limits.</p>
              <button type="button" className="story-link-button" onClick={() => setView("grid")}>
                Show grid view
              </button>
            </div>
          ) : (
            <div className="network-story" aria-describedby="grid-summary">
              <p className="map-instruction">Choose a battery location on the grid map.</p>

              <div className="network-map">
                <svg
                  className="network-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <defs>
                    <filter id="networkStressGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {scenario.lines.map((line) => {
                    const from = nodeById.get(line.from);
                    const to = nodeById.get(line.to);
                    const isCritical = line.id === "solar-substation";

                    if (!from || !to) {
                      return null;
                    }

                    return (
                      <line
                        key={line.id}
                        className="network-line"
                        data-critical={isCritical}
                        data-state={isCritical ? corridorState : "background"}
                        x1={mapXValue(from.x)}
                        y1={mapYValue(from.y)}
                        x2={mapXValue(to.x)}
                        y2={mapYValue(to.y)}
                        filter={isCritical && remainingOverload > 0 ? "url(#networkStressGlow)" : undefined}
                      />
                    );
                  })}

                  {scenario.nodes.map((node) => {
                    const isFocusNode = ["solar", "substation", "city", "industry"].includes(node.id);

                    return (
                      <g key={node.id} className="network-node" data-kind={node.kind} data-focus={isFocusNode}>
                        <circle cx={mapXValue(node.x)} cy={mapYValue(node.y)} r={isFocusNode ? 1.45 : 1} />
                      </g>
                    );
                  })}
                </svg>

                {scenario.nodes.filter((node) => visibleNodeLabels.has(node.id)).map((node) => {
                  const offset = labelOffsets[node.id] ?? { x: 0, y: 10, anchor: "middle" };

                  return (
                    <span
                      key={node.id}
                      className="network-map-label"
                      data-anchor={offset.anchor ?? "middle"}
                      style={{ "--x": mapX(node.x + offset.x), "--y": mapY(node.y + offset.y) } as CSSProperties}
                    >
                      {shortNodeLabels[node.id]}
                    </span>
                  );
                })}

                <span
                  className="network-map-label network-bottleneck-label"
                  data-anchor="middle"
                  data-state={corridorState}
                  style={{ "--x": mapX(35), "--y": mapY(55) } as CSSProperties}
                >
                  Constrained corridor
                </span>

                {(Object.entries(batteryPositions) as Array<[Exclude<BatteryPlacement, "none">, { x: number; y: number; label: string }]>).map(([option, position]) => (
                  <span
                    key={option}
                    className="network-battery-marker"
                    style={{ "--x": mapX(position.x), "--y": mapY(position.y) } as CSSProperties}
                    data-active={placement === option}
                    aria-hidden="true"
                  >
                    <BatteryCharging aria-hidden="true" size={16} />
                    <span>{position.label}</span>
                  </span>
                ))}
              </div>

              <div className="map-mode-row" aria-label="View mode and baseline">
                <button type="button" onClick={() => setView("national")}>
                  National totals
                </button>
                <button
                  type="button"
                  data-active={placement === "none"}
                  aria-pressed={placement === "none"}
                  onClick={() => setPlacement("none")}
                >
                  No battery
                </button>
                {(Object.entries(batteryPositions) as Array<[Exclude<BatteryPlacement, "none">, { label: string }]>).map(
                  ([option, position]) => (
                    <button
                      key={option}
                      type="button"
                      data-active={placement === option}
                      aria-pressed={placement === option}
                      onClick={() => setPlacement(option)}
                    >
                      {position.label}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
          <figcaption id="grid-summary">
            {view === "national"
              ? "The national total shows more generation than demand, but it does not show whether lines and substations can deliver it."
              : `${status}. ${stateSummary}`}
          </figcaption>
        </figure>

        {view === "grid" && (
          <div className="metric-strip" aria-label="Current bottleneck metrics">
            <div className="metric-wide">
              <span>Critical corridor</span>
              <strong>Solar-heavy rural area → Constrained station</strong>
            </div>
            <div>
              <span>Flow</span>
              <strong>{afterFlow} units</strong>
            </div>
            <div>
              <span>Capacity</span>
              <strong>{criticalCapacity} units</strong>
            </div>
            <div>
              <span>Battery relief</span>
              <strong>{batteryEffect} units</strong>
            </div>
            <div data-cleared={remainingOverload === 0}>
              <span>Remaining overload</span>
              <strong>{remainingOverload} units</strong>
            </div>
            <div>
              <span>Curtailment</span>
              <strong>{scenario.curtailment} illustrative units</strong>
            </div>
          </div>
        )}

        <div className="map-copy">
          <p className="visual-moment">
            <span>Enough electricity nationally.</span>
            <span>Not enough grid capacity locally.</span>
          </p>
          <p className="state-note">
            {view === "national"
              ? "The same national totals can hide a local bottleneck between where electricity is produced and where it is needed."
              : stateSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
