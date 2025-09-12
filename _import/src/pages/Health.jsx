export default function HealthMind() {
  return (
    <div className="page">
      <h1 className="title">Health & Mind</h1>
      <div className="grid2">
        <div className="card"><div className="tiny">Steps</div><div className="big">7,214</div></div>
        <div className="card"><div className="tiny">Meditation</div><div className="big">12 min</div></div>
      </div>
      <div className="card">
        <div className="sub">Mind & Journal</div>
        <textarea className="input" placeholder="What energized you today?" />
      </div>
    </div>
  );
}