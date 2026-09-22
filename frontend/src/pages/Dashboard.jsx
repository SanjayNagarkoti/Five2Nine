import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../service/userService";
import AppNav from "../components/AppNav";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, []);

  const isClient = user?.role === "CLIENT";

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <AppNav />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1B2140]">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Role: {user?.role}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          <Link
            to="/services"
            className="bg-white border rounded-xl p-6 hover:shadow-md"
          >
            <h2 className="font-semibold text-lg">Services</h2>
            <p className="text-sm text-gray-500 mt-2">
              {isClient
                ? "Browse freelancer services"
                : "Create and manage your services"}
            </p>
          </Link>

          <Link
            to="/projects"
            className="bg-white border rounded-xl p-6 hover:shadow-md"
          >
            <h2 className="font-semibold text-lg">Projects</h2>
            <p className="text-sm text-gray-500 mt-2">
              {isClient
                ? "Post your project requirements"
                : "Find projects to work on"}
            </p>
          </Link>

          <Link
            to="/proposals"
            className="bg-white border rounded-xl p-6 hover:shadow-md"
          >
            <h2 className="font-semibold text-lg">Proposals</h2>
            <p className="text-sm text-gray-500 mt-2">
              Manage negotiation and proposals
            </p>
          </Link>

          <Link
            to="/orders"
            className="bg-white border rounded-xl p-6 hover:shadow-md"
          >
            <h2 className="font-semibold text-lg">Orders</h2>
            <p className="text-sm text-gray-500 mt-2">
              View your accepted orders
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}