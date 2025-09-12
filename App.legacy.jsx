import { Routes, Route, Link } from "react-router-dom";
import YouPage from "./pages/YouPage";

export default function App(){
  return (
    <>
      <Routes>
        <Route path="/you" element={<YouPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

function Home(){
  return (
    <div className="app-shell" style={{padding:'24px'}}>
      <h1 style={{fontSize:32, fontWeight:800, margin:'12px 0'}}>Life OS</h1>
      <p>This is an installable PWA. It will stay on this version until you publish an update.</p>
      <div className="card" style={{marginTop:16}}>
        <div className="card-header"><div className="card-title">Pages</div></div>
        <ul>
          <li><Link to="/you">You (Vitals & trackers)</Link></li>
        </ul>
      </div>
      <div style={{opacity:.6, marginTop:18}}>Version: {import.meta.env.VITE_APP_VERSION || "0.0.0"}</div>
    </div>
  );
}