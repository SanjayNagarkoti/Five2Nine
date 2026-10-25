import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Compass,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  ShoppingBag,
  UserRound,
} from "lucide-react";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = readStoredUser();
  const isClient = user?.role?.toUpperCase() === "CLIENT";

  const links = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: isClient ? "Browse Services" : "My Services", to: "/services", icon: BriefcaseBusiness },
    { label: isClient ? "My Projects" : "Find Projects", to: "/projects", icon: Compass },
    { label: "Proposals", to: "/proposals", icon: MessageSquareText },
    { label: "Orders", to: "/orders", icon: ShoppingBag },
    { label: "Profile", to: "/profile", icon: UserRound },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7ece6] bg-white/95 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/dashboard" aria-label="Five2Nine dashboard" className="shrink-0 rounded-lg transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100">
          <img src="/brand/five2nine-logo-compact.svg" alt="Five2Nine" className="h-9 w-auto object-contain" />
        </Link>

        <div className="flex max-w-full flex-wrap items-center justify-end gap-1 sm:gap-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm ${active ? (isClient ? "bg-[#edf0fc] text-[#5267a5]" : "bg-[#e7f5eb] text-[#197d68]") : "text-[#6f8177] hover:bg-[#f4f7f3] hover:text-[#244936]"}`}>
                <Icon size={15} className="hidden sm:block" />
                {item.label}
              </Link>
            );
          })}
          <span className={`ml-1 hidden rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-wide sm:inline-flex ${isClient ? "bg-[#edf0fc] text-[#5267a5]" : "bg-[#e7f5eb] text-[#197d68]"}`}>
            {isClient ? "Client" : "Freelancer"}
          </span>
          <button type="button" onClick={logout} className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-[#fff0f0] px-3 py-2 text-xs font-semibold text-[#cf4848] transition hover:bg-[#ffe1e1] sm:text-sm">
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
