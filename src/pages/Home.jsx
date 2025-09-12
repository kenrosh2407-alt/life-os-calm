export default function Home() {
  return (
    <div className="page">
      <h1 className="title">Life‑OS</h1>
      <p className="sub">A calm space to track the essentials.</p>
      <div className="cards">
        <div className="card"><div className="sub">Tasks</div><div className="bar"><div className="bar-fill" style={{width:'40%'}}/></div><div className="tiny">2/5 completed</div></div>
        <div className="card"><div className="sub">Habits</div><div className="bar"><div className="bar-fill" style={{width:'60%'}}/></div><div className="tiny">3/5 kept</div></div>
      </div>
    </div>
  );
}