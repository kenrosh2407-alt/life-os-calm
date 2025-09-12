// src/store/useHealthStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Health / vitals state, persisted in localStorage.
 * Everything here is unit-agnostic but we use:
 * - weight in kg
 * - height in cm
 * - water in ml
 * - calories in kcal
 * - steps as a count
 */
export const useHealthStore = create(
  persist(
    (set, get) => ({
      // ---- VITALS ----
      weightKg: 72,
      heightCm: 175,

      // ---- TRACKERS ----
      steps: { value: 2500, goal: 8000 },
      waterMl: { value: 750, goal: 2500 },
      calories: { value: 900, goal: 2200 },

      // Apple-style activity rings (pick your own goals)
      rings: {
        move: { value: 340, goal: 1000 },     // kcal
        exercise: { value: 14, goal: 30 },    // minutes
        stand: { value: 6, goal: 12 },        // hours
      },

      // ---- DERIVED HELPERS (computed at call time) ----
      bmi() {
        const h = get().heightCm;
        const w = get().weightKg;
        const meters = h > 0 ? h / 100 : 0;
        if (!meters) return null;
        const v = w / (meters * meters);
        return Number.isFinite(v) ? Number(v.toFixed(1)) : null;
      },
      ringPct(key) {
        const r = get().rings[key];
        const pct = r.goal > 0 ? (r.value / r.goal) * 100 : 0;
        return Math.max(0, Math.min(100, pct));
      },
      overallRingsPct() {
        const keys = ["move", "exercise", "stand"];
        const p = keys.map(get().ringPct);
        return Math.round(p.reduce((a, b) => a + b, 0) / p.length);
      },

      // ---- MUTATORS ----
      setWeightKg(kg) {
        const v = Number(kg);
        if (!Number.isFinite(v)) return;
        set({ weightKg: v });
      },
      setHeightCm(cm) {
        const v = Number(cm);
        if (!Number.isFinite(v)) return;
        set({ heightCm: v });
      },

      addSteps(n = 500) {
        set((s) => ({ steps: { ...s.steps, value: Math.max(0, s.steps.value + n) } }));
      },
      setSteps(value) {
        const v = Number(value);
        if (!Number.isFinite(v)) return;
        set((s) => ({ steps: { ...s.steps, value: Math.max(0, v) } }));
      },

      addWater(ml = 250) {
        set((s) => ({ waterMl: { ...s.waterMl, value: Math.max(0, s.waterMl.value + ml) } }));
      },
      setWater(ml) {
        const v = Number(ml);
        if (!Number.isFinite(v)) return;
        set((s) => ({ waterMl: { ...s.waterMl, value: Math.max(0, v) } }));
      },

      logCalories(kcalDelta) {
        const d = Number(kcalDelta);
        if (!Number.isFinite(d)) return;
        set((s) => ({ calories: { ...s.calories, value: Math.max(0, s.calories.value + d) } }));
      },
      setCalories(kcal) {
        const v = Number(kcal);
        if (!Number.isFinite(v)) return;
        set((s) => ({ calories: { ...s.calories, value: Math.max(0, v) } }));
      },

      setRing(key, value) {
        const v = Number(value);
        if (!["move", "exercise", "stand"].includes(key) || !Number.isFinite(v)) return;
        set((s) => ({ rings: { ...s.rings, [key]: { ...s.rings[key], value: Math.max(0, v) } } }));
      },

      // Quick daily reset for counters (doesn't touch height/weight)
      resetToday() {
        set((s) => ({
          steps: { ...s.steps, value: 0 },
          waterMl: { ...s.waterMl, value: 0 },
          calories: { ...s.calories, value: 0 },
          rings: {
            move: { ...s.rings.move, value: 0 },
            exercise: { ...s.rings.exercise, value: 0 },
            stand: { ...s.rings.stand, value: 0 },
          },
        }));
      },
    }),
    {
      name: "health-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);