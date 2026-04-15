import { useState, useEffect } from "react";
import { API } from "../services/api";

export default function AddMember() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH MEMBERS =================
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/members");
      console.log("Members:", res.data);
      setMembers(res.data);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ================= ADD MEMBER =================
  const addMember = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Enter name and email ⚠️");
      return;
    }

    try {
      await API.post("/members", {
        name: name.trim(),
        email: email.trim(),
      });

      setName("");
      setEmail("");

      // ✅ instant UI update (no reload delay)
      fetchMembers();
    } catch (error) {
      console.error("Add Error:", error.response?.data || error.message);
      alert("Error adding member ❌");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Members</h2>

      {/* Input + Button */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={addMember}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Members List */}
      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : members.length > 0 ? (
          members.map((m) => (
            <div
              key={m._id}
              className="border p-2 mt-2 rounded bg-gray-100 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-gray-600">{m.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No members added yet</p>
        )}
      </div>
    </div>
  );
}
