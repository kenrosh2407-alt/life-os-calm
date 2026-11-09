// src/pages/YouPage.jsx
import React from "react";
import { useHealthStore } from "../useHealthStore";
import RadialGauge from "../components/RadialGauge";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";

export default function YouPage() {
  const {
    weightKg,
    heightCm,
    calories,
    rings,
    bmi,
    overallRingsPct,
    setWeightKg,
    setHeightCm,
    addSteps,
    addWater,
    logCalories,
  } = useHealthStore();

  const bmiValue = bmi(); // safe number or null

  const overallPct = overallRingsPct();

  const editNumber = (label, current, onCommit) => {
    const v = prompt(`${label}`, String(current ?? ""));
    if (v === null) return;
    onCommit(Number(v));
  };

  const kcalPct =
    calories.goal > 0 ? Math.min(100, Math.round((calories.value / calories.goal) * 100)) : 0;

  return (
    <div className="page-wrap">
      <div className="page-title">Summary</div>

      <div className="grid">
        {/* Activity / Rings */}
        <StatCard title="Activity" right={<span className="pill">9:41 AM</span>} colSpan={2}>
          <div className="rings-wrap">
            <RadialGauge
              value={overallPct}
              size={180}
              thickness={18}
              trackOpacity={0.15}
              // You can style the gauge via CSS variables if your component supports it
            />
            <div className="rings-legend">
              <LegendDot color="#ff3b30" label="Move" value={`${rings.move.value}/${rings.move.goal}`} />
              <LegendDot color="#34c759" label="Exercise" value={`${rings.exercise.value}/${rings.exercise.goal}`} />
              <LegendDot color="#0a84ff" label="Stand" value={`${rings.stand.value}/${rings.stand.goal}`} />
              <div className="chips-row">
                <button className="chip" onClick={() => addSteps(500)}>+500 steps</button>
                <button className="chip" onClick={() => addWater(250)}>+250 ml water</button>
              </div>
            </div>
          </div>
        </StatCard>

        {/* Weight */}
        <StatCard
          title="Weight"
          right={<button className="pill" onClick={() => editNumber("Enter weight (kg)", weightKg, setWeightKg)}>edit</button>}
        >
          <div className="big-number">{weightKg}<span className="unit">kg</span></div>
          <div className="muted">Tap edit below</div>
        </StatCard>

        {/* Height */}
        <StatCard
          title="Height"
          right={<button className="pill" onClick={() => editNumber("Enter height (cm)", heightCm, setHeightCm)}>edit</button>}
        >
          <div className="big-number">{heightCm}<span className="unit">cm</span></div>
        </StatCard>

        {/* BMI */}
        <StatCard title="BMI">
          <div className="big-number">
            {bmiValue ?? "--"}
          </div>
        </StatCard>

        {/* Calories */}
        <StatCard title="Calories" colSpan={2}>
          <div className="row-space">
            <div className="muted">Goal progress</div>
            <div className="muted">{kcalPct}%</div>
          </div>
          <ProgressBar value={kcalPct} />
          <div className="row-space">
            <div className="muted">{calories.value} / {calories.goal} kcal</div>
            <button className="pill" onClick={() => {
              const v = prompt("Add calories (kcal):", "250");
              if (v !== null) logCalories(Number(v));
            }}>log</button>
          </div>
        </StatCard>
      </div>

      {/* Bottom nav (static for now) */}
      <div className="tabbar">
        <div className="tab active"><span className="dot">❤️</span> Summary</div>
        <div className="tab">Sharing</div>
        <div className="tab">Browse</div>
      </div>
    </div>
  );
}

/* ---------- tiny helpers ---------- */

function LegendDot({ color, label, value }) {
  return (
    <div className="legend-item">
      <span className="legend-dot" style={{ background: color }} />
      <span className="legend-label">{label}</span>
      <span className="legend-value">{value}</span>
    </div>
  );
}