import { useState } from "react";
import { Eye, EyeOff, Hammer, Search, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser, testApi } from "../service/authService";
export default function Loginpage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userError, setuserError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const accent = "#1F8A70";

  const handleChange = (field) => (e) => {
    setuserError("");

    setForm((f) => ({
      ...f,
      [field]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginDto = {
      email: form.email,
      password: form.password,
    };

    try {
      const response = await authenticateUser(loginDto);
localStorage.setItem("token", response.token);

localStorage.setItem(
    "user",
    JSON.stringify({
        name: response.name,
        email: response.email,
        role: response.role,
    })
);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response.name,
          email: response.email,
          role: response.role,
        }),
      );
      console.log("Token Saved");
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        e.preventDefault();
        console.log(error.response);
        setuserError(error.response.data);
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center bg-[#E9E5DA]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="w-full max-w-[1360px] min-h-screen flex bg-[#FAF8F3] lg:shadow-[0_0_80px_rgba(27,33,64,0.12)]">
        {/* RIGHT PANEL — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[420px]">
            <>
              <h2
                className="text-[1.75rem] text-[#1B2140] mb-1.5"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
              >
                Login
              </h2>
              <p className="text-[#8288A8] text-sm mb-7">
                Don't have an account? {""}
                <Link
                  to="/signup"
                  className="text-[#0000ff] font-medium underline underline-offset-2 decoration-[#D8DAE8]"
                >
                  Sign up
                </Link>
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder={"Enter your registerd email"}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors "border-[#E7E5DD]"
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.password}
                      onChange={handleChange("password")}
                      placeholder="At least 8 characters"
                      className="w-full rounded-lg border border-[#E7E5DD] bg-white px-3.5 py-2.5 pr-10 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors focus:border-2"
                      onFocus={(e) => (e.target.style.borderColor = accent)}
                      onBlur={(e) => (e.target.style.borderColor = "#E7E5DD")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A79A] hover:text-[#6B7094]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="flex justify-end mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-[#6B7094] hover:text-[#1B2140] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 rounded-lg py-3 text-[14.5px] font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: accent }}
                >
                  Login
                  <ArrowRight size={16} />
                </button>
              </form>
              {userError && (
                <p className="text-red-500 text-xs mt-1">{userError}</p>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
