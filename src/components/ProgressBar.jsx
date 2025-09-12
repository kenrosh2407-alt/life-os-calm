// src/components/ProgressBar.jsx
import React, { useMemo } from "react";

/**
 * Glassy progress bar with subtle animation.
 * value: 0..100
 * label: optional text to show above the bar
 * suffix: optional trailing text at the right end (e.g. "41%")
 */
export default function ProgressBar({ value = 0, label, suffix }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const aria = useMemo(() => ({ role: "progressbar", "aria-valuenow": pct, "aria-valuemin": 0, "aria-valuemax": 100 }), [pct]);

  return (
    <div className="pb">
      {label ? <div className="pb__label">{label}</div> : null}

      <div className="pb__rail" {...aria}>
        <div className="pb__fill" style={{ width: `${pct}%` }}>
          <div className="pb__shine" />
        </div>
      </div>

      {suffix ? <div className="pb__suffix">{suffix}</div> : null}
    </div>
  );
}