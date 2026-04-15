import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, PlusCircle, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between bg-white shadow p-4">

      {/* Left side */}
      <div className="flex gap-6 items-center">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              isActive ? "text-blue-600 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          <Home size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/members"
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              isActive ? "text-blue-600 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          <Users size={20} />
          Members
        </NavLink>

        <NavLink
          to="/add-expense"
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              isActive ? "text-blue-600 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          <PlusCircle size={20} />
          Add Expense
        </NavLink>

      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            <User size={16} className="text-blue-500" />
            {user.name}
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </div>
  );
}