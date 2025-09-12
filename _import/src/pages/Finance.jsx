export default function Finance() {
  return (
    <div className="page">
      <h1 className="title">Finance</h1>
      <div className="card">
        <div className="sub">Wallet</div>
        <div className="big">₹ 12,500</div>
        <div className="tiny">Budget remaining</div>
      </div>
      <div className="card">
        <div className="sub">Recent</div>
        <div className="list">
          <div className="row"><span>Groceries</span><span>-₹ 820</span></div>
          <div className="row"><span>Protein</span><span>-₹ 2,499</span></div>
          <div className="row"><span>Auto</span><span>-₹ 120</span></div>
        </div>
      </div>
    </div>
  );
}