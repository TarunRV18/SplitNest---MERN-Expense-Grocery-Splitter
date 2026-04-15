import { useState, useEffect } from "react";
import { API } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0], // ✅ always defaults to today
    description: "",
  });

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/members").then((res) => {
      const data = res.data;
      setMembers(data);
      // ✅ auto-select all members by default
      setSelectedMembers(data.map((m) => m._id));
    });
  }, []);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const getSplitAmount = () => {
    const amt = parseFloat(form.amount);
    if (!amt || selectedMembers.length === 0) return "0.00";
    return (amt / selectedMembers.length).toFixed(2);
  };

  const handleSubmit = async () => {
    // ── Frontend validation ──
    const amount = parseFloat(form.amount);

    if (!form.amount || isNaN(amount) || amount <= 0) {
      alert("❌ Please enter a valid amount greater than 0");
      return;
    }
    if (!form.category) {
      alert("❌ Please select a category");
      return;
    }
    if (selectedMembers.length === 0) {
      alert("❌ Please select at least one member to split with");
      return;
    }

    const splitAmt = parseFloat((amount / selectedMembers.length).toFixed(2));
    const splits = selectedMembers.map((id) => ({
      user: id,
      amount: splitAmt,
    }));

    const payload = {
      amount,
      category: form.category,
      description: form.description || "",
      date: form.date || new Date().toISOString().split("T")[0],
      splits,
    };

    console.log("📤 Submitting expense:", payload);

    try {
      setLoading(true);
      const res = await API.post("/expenses", payload);
      console.log("✅ Expense saved:", res.data);
      alert("✅ Expense added successfully!");
      // Reset form
      setForm({
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      navigate("/expenses");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Server error";
      console.error("❌ Submit error:", msg);
      alert(`❌ Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-bold mb-6">Add Expense</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Amount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Amount (₹)</label>
          <input
            type="number"
            className="border p-2 rounded bg-gray-800 text-white"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Category</label>
          <select
            className="border p-2 rounded bg-gray-800 text-white"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select category</option>
            <option value="food">🍔 Food</option>
            <option value="transport">🚗 Transport</option>
            <option value="accommodation">🏨 Accommodation</option>
            <option value="entertainment">🎮 Entertainment</option>
            <option value="shopping">🛍️ Shopping</option>
            <option value="utilities">💡 Utilities</option>
            <option value="health">💊 Health</option>
            <option value="other">📦 Other</option>
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Date</label>
          <input
            type="date"
            className="border p-2 rounded bg-gray-800 text-white"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Description (optional)</label>
          <input
            type="text"
            className="border p-2 rounded bg-gray-800 text-white"
            placeholder="e.g. Dinner at restaurant"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>

      {/* Split between */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 block mb-2">Split equally between</label>
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">No members found. Add members first.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <label
                key={m._id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-all ${
                  selectedMembers.includes(m._id)
                    ? "border-purple-500 bg-purple-900/30 text-purple-300"
                    : "border-gray-600 text-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-purple-500"
                  checked={selectedMembers.includes(m._id)}
                  onChange={() => toggleMember(m._id)}
                />
                {m.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Split preview */}
      {form.amount && selectedMembers.length > 0 && (
        <div className="mb-4 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          {selectedMembers.map((id) => {
            const m = members.find((m) => m._id === id);
            return (
              <div key={id} className="flex justify-between items-center px-4 py-2 border-b border-gray-700 last:border-0">
                <span className="text-sm text-white font-medium">{m?.name}</span>
                <span className="text-sm text-purple-300 font-bold">₹{getSplitAmount()}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 transition"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
        <button
          onClick={() => {
            setForm({ amount: "", category: "", date: new Date().toISOString().split("T")[0], description: "" });
            setSelectedMembers(members.map((m) => m._id));
          }}
          className="px-5 py-2.5 border border-gray-600 rounded-lg text-gray-400 hover:text-white transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}