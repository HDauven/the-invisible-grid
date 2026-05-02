"use client";

import { BatteryCharging, Map as MapIcon, Network } from "lucide-react";
import { useMemo, useState } from "react";
import {
  congestionScenario,
  lineStress,
  type BatteryPlacement
} from "@/lib/model/congestion";
import { ToggleGroup } from "@/components/ui/ToggleGroup";

type ViewMode = "national" | "grid";

const placementLabels: Record<BatteryPlacement, string> = {
  solar: "Near solar",
  city: "Near city",
  bottleneck: "At bottleneck"
};

export function CongestionBatteryInteractive() {
  const [view, setView] = useState<ViewMode>("grid");
  const [placement, setPlacement] = useState<BatteryPlacement>("city");
  const scenario = useMemo(() => congestionScenario(placement), [placement]);

  const nodeById = new globalThis.Map(scenario.nodes.map((node) => [node.id, node]));
  const batteryNode = nodeById.get(placement === "bottleneck" ? "substation" : placement);
  const stateSummary =
    placement === "bottleneck"
      ? "Placed at the bottleneck, the battery relieves the actual constraint and the overloaded corridor calms down."
      : placement === "solar"
        ? "Placed near solar, the battery absorbs some surplus, but the downstream corridor can still be constrained."
        : "Placed near the city, the battery helps local peak demand, but it does not fully clear the upstream bottleneck.";

  return (
    <div className="interactive map-panel">
      <div className="panel-heading">
        <span>
          {view === "national" ? <MapIcon aria-hidden="true" size={18} /> : <Network aria-hidden="true" size={18} />}
          {view === "national" ? "National view" : "Grid view"}
        </span>
        <strong>
          {view === "national" ? "+8 supply units" : `${scenario.congestionRelief} units relief`}
        </strong>
      </div>

      <div className="map-grid">
        <figure className="grid-map" aria-labelledby="grid-summary">
          {view === "national" ? (
            <div className="national-card" role="img" aria-describedby="grid-summary">
              <div>
                <span>Total generation</span>
                <strong>{scenario.nationalGeneration}</strong>
              </div>
              <div>
                <span>Total demand</span>
                <strong>{scenario.nationalDemand}</strong>
              </div>
              <p>Enough electricity nationally.</p>
              <p>But totals hide local wire limits.</p>
            </div>
          ) : (
            <svg viewBox="0 0 700 460" role="img" aria-describedby="grid-summary">
              <defs>
                <filter id="stressGlow">
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

                if (!from || !to) {
                  return null;
                }

                const stress = lineStress(line);

                return (
                  <g key={line.id}>
                    <line
                      className="grid-line"
                      data-stress={stress}
                      x1={`${from.x}%`}
                      y1={`${from.y}%`}
                      x2={`${to.x}%`}
                      y2={`${to.y}%`}
                      filter={stress === "overloaded" ? "url(#stressGlow)" : undefined}
                    />
                    <line
                      className="flow-pulse"
                      data-stress={stress}
                      x1={`${from.x}%`}
                      y1={`${from.y}%`}
                      x2={`${to.x}%`}
                      y2={`${to.y}%`}
                    />
                    <text
                      className="flow-label"
                      data-stress={stress}
                      x={`${(from.x + to.x) / 2}%`}
                      y={`${(from.y + to.y) / 2}%`}
                    >
                      {stress === "overloaded" ? "over limit" : stress === "near" ? "near limit" : "within limit"}
                    </text>
                    <text
                      className="flow-unit-label"
                      x={`${(from.x + to.x) / 2}%`}
                      y={`${(from.y + to.y) / 2 + 4}%`}
                    >
                      {Math.round(line.flow)} flow / {line.capacity} capacity
                    </text>
                  </g>
                );
              })}

              {scenario.nodes.map((node) => (
                <g key={node.id} className="node" data-kind={node.kind}>
                  <circle cx={`${node.x}%`} cy={`${node.y}%`} r="10" />
                  <text
                    x={`${node.x}%`}
                    y={`${node.y + (node.id === "city" || node.id === "substation" ? -5 : 5)}%`}
                  >
                    {node.label}
                  </text>
                </g>
              ))}

              <g className="battery-node">
                <circle
                  cx={`${batteryNode?.x}%`}
                  cy={`${batteryNode?.y}%`}
                  r="18"
                />
                <circle
                  className="battery-charge"
                  cx={`${batteryNode?.x}%`}
                  cy={`${batteryNode?.y}%`}
                  r="25"
                />
                <text
                  x={`${batteryNode?.x}%`}
                  y={`${(batteryNode?.y ?? 0) - 5}%`}
                >
                  battery
                </text>
              </g>
            </svg>
          )}
          <figcaption id="grid-summary">
            {view === "national"
              ? "The national total shows more generation than demand, but it does not show whether lines and substations can deliver it."
              : `${stateSummary} Curtailment is ${scenario.curtailment} illustrative units.`}
          </figcaption>
        </figure>

        <div className="map-copy">
          <p className="visual-moment">
            <span>Enough electricity nationally.</span>
            <span>Not enough grid capacity locally.</span>
          </p>
          <p>
            The red corridor is the actual constraint. A battery can shift energy anywhere, but it
            reduces congestion most when it is placed where the constraint is binding.
          </p>
          <p className="state-note">{stateSummary}</p>
        </div>
      </div>

      <div className="control-grid">
        <ToggleGroup<ViewMode>
          label="View"
          value={view}
          options={[
            { value: "national", label: "National" },
            { value: "grid", label: "Grid" }
          ]}
          onChange={setView}
        />

        <div className="control">
          <span className="control-label">Battery placement</span>
          <div className="placement-grid" role="group" aria-label="Battery placement">
            {(Object.keys(placementLabels) as BatteryPlacement[]).map((option) => (
              <button
                key={option}
                className="placement-button"
                data-active={option === placement}
                type="button"
                aria-pressed={option === placement}
                onClick={() => setPlacement(option)}
              >
                <BatteryCharging aria-hidden="true" size={16} />
                {placementLabels[option]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
