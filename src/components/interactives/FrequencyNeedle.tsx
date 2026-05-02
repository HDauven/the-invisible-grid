"use client";

import { Gauge, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { frequencyStatus, targetFrequency, type InertiaMode } from "@/lib/model/frequency";
import { Slider } from "@/components/ui/Slider";
import { ToggleGroup } from "@/components/ui/ToggleGroup";

function frequencyToAngle(frequency: number) {
  const normalized = (frequency - 49.5) / 1;
  return -72 + normalized * 144;
}

export function FrequencyNeedle() {
  const [demandRise, setDemandRise] = useState(46);
  const [response, setResponse] = useState(false);
  const [inertia, setInertia] = useState<InertiaMode>("high");
  const [shownFrequency, setShownFrequency] = useState(50);

  const target = useMemo(() => targetFrequency(demandRise, response), [demandRise, response]);
  const angle = frequencyToAngle(shownFrequency);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      const id = window.setTimeout(() => setShownFrequency(target), 0);
      return () => window.clearTimeout(id);
    }

    const speed = inertia === "low" ? 0.25 : 0.08;
    const id = window.setInterval(() => {
      setShownFrequency((current) => current + (target - current) * speed);
    }, 32);

    return () => window.clearInterval(id);
  }, [target, inertia]);

  return (
    <div className="interactive frequency-panel">
      <div className="panel-heading">
        <span>
          <Gauge aria-hidden="true" size={18} />
          Live balance
        </span>
        <strong>{shownFrequency.toFixed(2)} Hz</strong>
      </div>

      <figure className="gauge-wrap" aria-labelledby="frequency-summary">
        <svg viewBox="0 0 520 320" role="img" aria-describedby="frequency-summary">
          <defs>
            <linearGradient id="gaugeBand" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#d65b4a" />
              <stop offset="48%" stopColor="#9eb68d" />
              <stop offset="52%" stopColor="#9eb68d" />
              <stop offset="100%" stopColor="#d99636" />
            </linearGradient>
          </defs>
          <path
            className="gauge-arc"
            d="M 84 235 A 176 176 0 0 1 436 235"
            pathLength="100"
          />
          <path
            className="gauge-arc-color"
            d="M 84 235 A 176 176 0 0 1 436 235"
            pathLength="100"
          />
          <text className="gauge-zone left" x="88" y="266">
            too little generation
          </text>
          <text className="gauge-zone center" x="260" y="88">
            50 Hz
          </text>
          <text className="gauge-zone right" x="432" y="266">
            too much generation
          </text>
          <g transform="translate(260 236)">
            <line
              className="needle"
              x1="0"
              y1="16"
              x2="0"
              y2="-132"
              transform={`rotate(${angle})`}
            />
            <circle className="needle-hub" r="18" />
          </g>
        </svg>
        <figcaption id="frequency-summary">
          {frequencyStatus(shownFrequency)} High inertia makes the needle move more slowly; low
          inertia makes the same imbalance show up faster.
        </figcaption>
      </figure>

      <div className="control-grid">
        <Slider
          id="demand-rise"
          label="Demand rises"
          value={demandRise}
          min={0}
          max={100}
          leftLabel="quiet"
          rightLabel="peak"
          onChange={setDemandRise}
        />

        <button
          className="response-button"
          data-active={response}
          type="button"
          aria-pressed={response}
          onClick={() => setResponse((current) => !current)}
        >
          <Zap aria-hidden="true" size={17} />
          {response ? "Fast response added" : "Add fast response"}
        </button>

        <ToggleGroup<InertiaMode>
          label="Inertia"
          value={inertia}
          options={[
            { value: "high", label: "High" },
            { value: "low", label: "Low" }
          ]}
          onChange={setInertia}
        />
      </div>
    </div>
  );
}
