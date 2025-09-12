// src/components/RadialGauge.jsx
import React from "react";

const RadialGauge = ({ value, size = 210 }) => {
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // ring progress
  const progress = (pct) =>
    circumference - (pct / 100) * circumference;

  return (
    <div className="rings" style={{ "--size": `${size}px` }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Gradients for glow rings */}
          <linearGradient id="gradMove" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff3b30" />
            <stop offset="100%" stopColor="#ff9f0a" />
          </linearGradient>
          <linearGradient id="gradExercise" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34c759" />
            <stop offset="100%" stopColor="#30d158" />
          </linearGradient>
          <linearGradient id="gradStand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a84ff" />
            <stop offset="100%" stopColor="#64d2ff" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          className="track"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Move ring */}
        <circle
          className="move"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress(value.move)}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Exercise ring */}
        <circle
          className="exercise"
          strokeWidth={strokeWidth - 5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress(value.exercise)}
          fill="none"
          r={radius - 24}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Stand ring */}
        <circle
          className="stand"
          strokeWidth={strokeWidth - 8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress(value.stand)}
          fill="none"
          r={radius - 46}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      <div className="label">
        <div className="percent">{value.overall}%</div>
        <div className="small">overall</div>
      </div>
    </div>
  );
};

export default RadialGauge;