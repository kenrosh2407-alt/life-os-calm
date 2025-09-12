// src/components/StatCard.jsx
import React from "react";

export default function StatCard({
  title,
  time = "",
  children,
  footer,
  dense = false,
  className = "",
}) {
  return (
    <section className={`card ${dense ? "card--dense" : ""} ${className}`}>
      <header className="card__header">
        <div className="card__title">{title}</div>
        {time ? <div className="card__time">{time}</div> : null}
      </header>

      <div className="card__body">{children}</div>

      {footer ? <footer className="card__footer">{footer}</footer> : null}
    </section>
  );
}