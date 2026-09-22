import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#1B2140]">
          Five2Nine
        </h1>

        <p className="text-gray-500 mt-3">
          Freelance. Hire. Negotiate. Work.
        </p>

        <div className="flex gap-3 justify-center mt-8">
          {token ? (
            <Link to="/dashboard" className="btn">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn">
                Login
              </Link>

              <Link
                to="/signup"
                className="border border-gray-300 px-5 py-2.5 rounded-lg"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}