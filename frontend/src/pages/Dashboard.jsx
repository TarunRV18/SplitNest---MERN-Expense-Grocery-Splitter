import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { API } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [settleAmount, setSettleAmount] = useState("");
  const [fromMember, setFromMember] = useState("");
  const [toMember, setToMember] = useState("");

  const [settlements, setSettlements] = useState([]);

  const fetchAll = () => {
    API.get("/expenses").then((res) => setExpenses(res.data));
    API.get("/members").then((res) => setMembers(res.data));
    API.get("/settlements").then((res) => setSettlements(res.data));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Pre-select current user in "From" dropdown when members load
  useEffect(() => {
    if (user && members.length > 0) {
      const myMember = members.find(m => m.email === user.email);
      if (myMember) setFromMember(myMember._id);
    }
  }, [user, members]);

  const handleSettle = async (e) => {
    e.preventDefault();
    if (!fromMember || !toMember || !settleAmount) {
      alert("Please fill all fields");
      return;
    }
    if (fromMember === toMember) {
      alert("Cannot settle with same member");
      return;
    }
    try {
      await API.post("/settlements", {
        from: fromMember,
        to: toMember,
        amount: Number(settleAmount),
      });
      alert("Settlement recorded!");
      setSettleAmount("");
      setFromMember("");
      setToMember("");
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Error recording settlement");
    }
  };

  const getMemberSummary = () => {
    const summary = {};
    members.forEach((m) => {
      summary[m._id] = { id: m._id, name: m.name, email: m.email, paid: 0, share: 0 };
    });

    expenses.forEach((e) => {
      if (e.paidBy?._id && summary[e.paidBy._id]) {
        summary[e.paidBy._id].paid += e.amount;
      }
      e.splits.forEach((s) => {
        if (s.user?._id && summary[s.user._id]) {
          summary[s.user._id].share += s.amount;
        }
      });
    });

    settlements.forEach((s) => {
      if (s.from?._id && summary[s.from._id]) {
        summary[s.from._id].paid += s.amount;
      }
      if (s.to?._id && summary[s.to._id]) {
        summary[s.to._id].paid -= s.amount;
      }
    });

    return Object.values(summary);
  };

  useEffect(() => {
    if (location.state?.addedExpense) {
      setExpenses((prev) => [location.state.addedExpense, ...prev]);
    }
  }, [location.state]);

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-card">
          <h2>Dashboard</h2>

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/add-expense" className="btn btn-primary">
              Add expense
            </Link>
            <Link to="/members" className="btn" style={{ background: "#4a5568", color: "white" }}>
              Manage Members
            </Link>
          </div>

          <div className="member-summary" style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Member Summary</h3>
            <div className="expense-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {getMemberSummary().map((m, idx) => (
                <div 
                  key={idx} 
                  className="expense-item" 
                  style={{ 
                    borderLeft: "4px solid #48bb78",
                    background: user?.email === m.email ? "var(--accent-bg)" : "var(--bg2)",
                    borderColor: user?.email === m.email ? "var(--accent)" : "#48bb78"
                  }}
                >
                  <h4 style={{ color: user?.email === m.email ? "var(--accent2)" : "inherit" }}>
                    {m.name} {user?.email === m.email && "(You)"}
                  </h4>
                  <p><strong>Total Paid:</strong> ₹{m.paid.toFixed(2)}</p>
                  <p><strong>Total Share:</strong> ₹{m.share.toFixed(2)}</p>
                  <p style={{ color: m.paid - m.share >= 0 ? "#48bb78" : "#f56565" }}>
                    <strong>{m.paid - m.share >= 0 ? "To receive:" : "To pay:"}</strong> ₹{Math.abs(m.paid - m.share).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="settle-section" style={{ marginTop: "2rem", padding: "1rem", background: "#f7fafc", borderRadius: "8px" }}>
            <h3>Settle Debt</h3>
            <form onSubmit={handleSettle} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
              <select
                value={fromMember}
                onChange={(e) => setFromMember(e.target.value)}
                className="input"
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }}
              >
                <option value="">From (Who is paying)</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>

              <select
                value={toMember}
                onChange={(e) => setToMember(e.target.value)}
                className="input"
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }}
              >
                <option value="">To (Who is receiving)</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }}
              />

              <button type="submit" className="btn btn-primary">Settle Now</button>
            </form>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3>Expenses</h3>
          </div>

          <div className="expense-grid">
            {expenses.length ? (
              expenses.map((e) => (
                <div key={e._id} className="expense-item">
                  <h3>{e.category}</h3>
                  <p>
                    <strong>Amount:</strong> ₹{e.amount}
                  </p>
                  <p>
                    <strong>Paid by:</strong> {e.paidBy?.name || "Unknown"}
                  </p>
                  <p>{new Date(e.date || e.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p style={{ marginTop: "1rem" }}>No expenses found yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}