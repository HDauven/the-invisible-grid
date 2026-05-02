"use client";

import { Scale } from "lucide-react";
import { useState } from "react";
import {
  systemValueProfiles,
  type SystemValueId,
  type SystemValueProfile
} from "@/data/systemValueProfiles";
import { ToggleGroup } from "@/components/ui/ToggleGroup";

const effectLabels: Array<[keyof SystemValueProfile["systemEffects"], string]> = [
  ["timing", "timing"],
  ["location", "location"],
  ["flexibility", "flexibility"],
  ["firmCapacity", "firm capacity"],
  ["reserves", "reserves"],
  ["stability", "inertia/stability"],
  ["curtailment", "curtailment"],
  ["gridUpgrades", "grid upgrades"],
  ["fuelRisk", "fuel risk"],
  ["financingRisk", "financing risk"]
];

function CostBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="system-cost-row">
      <span>{label}</span>
      <i aria-label={`${label}: ${value} out of 5`}>
        {Array.from({ length: 5 }, (_, index) => (
          <b data-filled={index < value} key={index} />
        ))}
      </i>
    </div>
  );
}

export function SystemValueInteractive() {
  const [selectedId, setSelectedId] = useState<SystemValueId>("solar");
  const selected = systemValueProfiles.find((profile) => profile.id === selectedId) ?? systemValueProfiles[0];

  return (
    <div className="interactive system-value-panel">
      <div className="panel-heading">
        <span>
          <Scale aria-hidden="true" size={18} />
          Cost and value
        </span>
        <strong>{selected.name}</strong>
      </div>

      <div className="system-value-grid" aria-labelledby="system-value-summary">
        <section>
          <h3>Plant cost</h3>
          <CostBar label="construction" value={selected.plantCost.construction} />
          <CostBar label="fuel" value={selected.plantCost.fuel} />
          <CostBar label="maintenance" value={selected.plantCost.maintenance} />
        </section>

        <section>
          <h3>System value / system cost</h3>
          <div className="system-effect-grid">
            {effectLabels.map(([key, label]) => (
              <span data-level={selected.systemEffects[key]} key={key}>
                {label}
              </span>
            ))}
          </div>
        </section>
      </div>

      <p className="state-note" id="system-value-summary">
        {selected.summary}
      </p>

      <ToggleGroup
        label="Technology lens"
        value={selectedId}
        options={systemValueProfiles.map((profile) => ({ value: profile.id, label: profile.name }))}
        onChange={setSelectedId}
      />
    </div>
  );
}
