import { Link, useNavigate } from "react-router-dom";

export default function AppNav() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-xl font-bold text-[#1B2140]"
        >
          Five2Nine
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/services">Services</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/proposals">Proposals</Link>
          <Link to="/orders">Orders</Link>

          <span className="font-medium text-[#1F8A70]">
            {user?.role}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}