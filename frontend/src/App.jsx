import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import AddMember from "./pages/AddMember";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Layout() {
  const location = useLocation();

  // ❌ Pages where navbar should NOT show
  const hideNavbarRoutes = ["/", "/register"];

  return (
    <>
      {/* ✅ Show Navbar only if NOT login/register */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/members" element={<AddMember />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}