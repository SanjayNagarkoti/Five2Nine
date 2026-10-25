
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FolderKanban,
  MessageSquareText,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from "lucide-react";

import AppNav from "../components/AppNav";
import { getCurrentUser } from "../service/userService";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        setError("");
        const data = await getCurrentUser();

        if (active) setUser(data);
      } catch (err) {
        console.error("Dashboard load failed:", err);

        if (active) {
          setError("We couldn't load your workspace.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const role = user?.role?.toUpperCase();
  const isClient = role === "CLIENT";

  const name = user?.name?.trim() || "there";
  const firstName = name.split(/\s+/)[0];

  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "F2";

  // Prefer the backend's completion percentage so the dashboard and profile
  // page display the same value. Fall back to the same role-based fields if
  // the API response doesn't include it yet.
  const profileFields = isClient
    ? ["bio", "location", "website", "companyName", "companyRole", "hiringFocus"]
    : ["bio", "location", "website", "headline", "skills", "experience"];

  const isProfileFieldFilled = (value) =>
    Array.isArray(value) ? value.length > 0 : String(value ?? "").trim().length > 0;

  const calculatedCompletion = Math.round(
    (profileFields.filter((field) => isProfileFieldFilled(user?.[field])).length /
      profileFields.length) *
      100
  );

  const profileCompletion =
    user?.completionPercent !== undefined &&
    user?.completionPercent !== null &&
    Number.isFinite(Number(user.completionPercent))
      ? Math.max(0, Math.min(100, Math.round(Number(user.completionPercent))))
      : calculatedCompletion;

  const showProfileReminder = profileCompletion < 100;

  const cards = isClient
    ? [
        {
          title: "Discover talent",
          description:
            "Browse services and find the right freelancer for your requirements.",
          action: "Browse services",
          to: "/services",
          icon: Search,
          iconStyle: "bg-[#e7edfc] text-[#5267a5]",
        },
        {
          title: "My projects",
          description:
            "Create project requirements and keep your hiring work organised.",
          action: "Manage projects",
          to: "/projects",
          icon: FolderKanban,
          iconStyle: "bg-[#e6f4eb] text-[#287d61]",
        },
        {
          title: "Proposals",
          description:
            "Review freelancer offers and keep negotiations moving.",
          action: "Review proposals",
          to: "/proposals",
          icon: MessageSquareText,
          iconStyle: "bg-[#f1eafe] text-[#8063b7]",
        },
        {
          title: "Orders",
          description:
            "Keep track of accepted work and project commitments.",
          action: "Manage orders",
          to: "/orders",
          icon: ShoppingBag,
          iconStyle: "bg-[#fff1df] text-[#ad792f]",
        },
      ]
    : [
        {
          title: "My services",
          description:
            "Manage your service listings, pricing and delivery timelines.",
          action: "Manage services",
          to: "/services",
          icon: BriefcaseBusiness,
          iconStyle: "bg-[#e2f4e9] text-[#197d68]",
        },
        {
          title: "Find projects",
          description:
            "Explore client requirements and discover your next opportunity.",
          action: "Explore projects",
          to: "/projects",
          icon: Compass,
          iconStyle: "bg-[#e7edfc] text-[#5267a5]",
        },
        {
          title: "Proposals",
          description:
            "Keep track of offers, negotiations and client responses.",
          action: "Manage proposals",
          to: "/proposals",
          icon: MessageSquareText,
          iconStyle: "bg-[#f1eafe] text-[#8063b7]",
        },
        {
          title: "Orders",
          description:
            "Stay organised with your accepted work and deliveries.",
          action: "View orders",
          to: "/orders",
          icon: ShoppingBag,
          iconStyle: "bg-[#fff1df] text-[#ad792f]",
        },
      ];

  const nextSteps = isClient
    ? [
        {
          title: "Explore freelancer services",
          description: "Find skills that match your requirements.",
          to: "/services",
          icon: Search,
        },
        {
          title: "Organise your projects",
          description: "Create or review your project requirements.",
          to: "/projects",
          icon: FolderKanban,
        },
        {
          title: "Review your proposals",
          description: "Keep hiring conversations moving.",
          to: "/proposals",
          icon: MessageSquareText,
        },
      ]
    : [
        {
          title: "Review your services",
          description: "Keep your offerings and prices up to date.",
          to: "/services",
          icon: BriefcaseBusiness,
        },
        {
          title: "Discover new opportunities",
          description: "Look for projects that match your skills.",
          to: "/projects",
          icon: Compass,
        },
        {
          title: "Follow your proposals",
          description: "Stay on top of offers and negotiations.",
          to: "/proposals",
          icon: MessageSquareText,
        },
      ];

  const primaryColor = isClient
    ? "bg-[#5367a5] hover:bg-[#43568f] shadow-[0_4px_0_#384977]"
    : "bg-[#197d68] hover:bg-[#146957] shadow-[0_4px_0_#115a49]";

  const heroBackground = isClient
    ? "from-white via-[#f6f7fd] to-[#e9edfa]"
    : "from-white via-[#f3faf5] to-[#e0f2e6]";

  const accentText = isClient
    ? "text-[#5267a5]"
    : "text-[#197d68]";

  return (
    <div
      className={`min-h-screen ${
        isClient ? "bg-[#f6f7fb]" : "bg-[#f5f8f5]"
      } text-[#1b332d]`}
    >
      <AppNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {loading ? (
          <div
            role="status"
            className="animate-pulse space-y-5"
          >
            <div className="h-7 w-56 rounded-lg bg-[#e3eae4]" />
            <div className="h-72 rounded-[28px] bg-white" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-48 rounded-3xl bg-white ring-1 ring-[#e5ebe5]"
                />
              ))}
            </div>
            <span className="sr-only">Loading dashboard...</span>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-3xl border border-rose-200 bg-white p-8 text-center"
          >
            <h1 className="text-xl font-semibold">
              Workspace unavailable
            </h1>
            <p className="mt-2 text-sm text-[#78877e]">
              {error} Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* PERSONAL WELCOME */}
            <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div
                  className={`mb-3 inline-flex items-center gap-2 rounded-full border border-[#e1eae1] bg-white px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] ${accentText}`}
                >
                  <Sparkles size={14} />
                  {isClient ? "HIRING WORKSPACE" : "FREELANCER WORKSPACE"}
                </div>

                <h1 className="font-display text-3xl font-medium tracking-[-0.045em] text-[#1b332d] sm:text-4xl">
                  {isClient
                    ? `Welcome back, ${firstName}.`
                    : `Good to see you, ${firstName}.`}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7d8d83] sm:text-base">
                  {isClient
                    ? "Find the right people, organise your projects and turn your ideas into finished work."
                    : "Find exciting projects, manage your services and keep your freelance business moving."}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#e3eae3] bg-white px-3.5 py-2 shadow-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isClient ? "bg-[#6478bd]" : "bg-[#299b73]"
                  }`}
                />
                <span className="text-xs font-semibold text-[#61766a]">
                  {isClient ? "Client account" : "Freelancer account"}
                </span>
              </div>
            </section>

            {/* ROLE-SPECIFIC HERO */}
            <section
              className={`relative overflow-hidden rounded-[28px] border border-[#dfe9df] bg-gradient-to-br ${heroBackground} p-6 shadow-[0_16px_45px_rgba(37,82,57,0.06)] sm:p-9 lg:p-10`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-[34px] border-white/50"
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -bottom-28 right-36 h-56 w-56 rounded-full blur-3xl ${
                  isClient ? "bg-[#dce4fa]/70" : "bg-[#ccebd5]/70"
                }`}
              />

              <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_300px]">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-[0.18em] ${accentText}`}>
                    {isClient
                      ? "MAKE YOUR NEXT MOVE"
                      : "GROW YOUR FREELANCE BUSINESS"}
                  </p>

                  <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-[1.14] tracking-[-0.045em] text-[#1b332d] sm:text-4xl lg:text-[46px]">
                    {isClient ? (
                      <>
                        Great work starts
                        <br className="hidden sm:block" /> with the right people.
                      </>
                    ) : (
                      <>
                        Your skills deserve
                        <br className="hidden sm:block" /> the right opportunity.
                      </>
                    )}
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-[#71857a] sm:text-base">
                    {isClient
                      ? "Discover skilled freelancers, post your project needs and compare proposals—all in one place."
                      : "Showcase what you do best, discover client projects and build lasting professional relationships."}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      to={isClient ? "/services" : "/projects"}
                      className={`group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 active:translate-y-0 ${primaryColor}`}
                    >
                      {isClient ? "Explore services" : "Find projects"}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>

                    <Link
                      to={isClient ? "/projects" : "/services"}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe6dc] bg-white/90 px-5 py-3.5 text-sm font-semibold text-[#345b48] transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      {isClient ? (
                        <>
                          <Plus size={16} />
                          My projects
                        </>
                      ) : (
                        <>
                          <BriefcaseBusiness size={16} />
                          My services
                        </>
                      )}
                    </Link>
                  </div>

                  <div className="mt-7 flex items-center gap-2 text-xs text-[#809087]">
                    <CheckCircle2 size={15} className={accentText} />
                    {isClient
                      ? "Your hiring activities, together in one workspace."
                      : "Your services, opportunities and client work, together in one place."}
                  </div>
                </div>

                {/* ROLE-SPECIFIC ACCOUNT PANEL */}
                <div className="rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_18px_40px_rgba(28,67,45,0.09)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_rgba(28,67,45,0.13)] sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#839087]">
                      {isClient ? "HIRING PROFILE" : "FREELANCER ACCOUNT"}
                    </p>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${isClient ? "bg-[#edf0fc] text-[#5267a5]" : "bg-[#e7f5eb] text-[#287d61]"}`}>
                      Signed in
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-bold ${isClient ? "bg-gradient-to-br from-[#e4e9fb] to-[#cbd5f7] text-[#455a99]" : "bg-gradient-to-br from-[#d7eee0] to-[#b8dfc8] text-[#1a644e]"}`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#234335]">
                        {name}
                      </h3>
                      <p className="mt-1 truncate text-xs text-[#829188]">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#edf1ed] pt-4">
                    <p className="text-xs leading-5 text-[#78887e]">
                      {isClient
                        ? "Ready to hire? Browse services or organise your project requirements."
                        : "Ready for your next opportunity? Keep your services up to date and explore available projects."}
                    </p>

                    <Link
                      to={isClient ? "/services" : "/projects"}
                      className={`mt-4 flex items-center justify-between rounded-xl border border-[#e5ece5] px-3.5 py-3 text-sm font-semibold transition hover:bg-[#f6faf6] ${accentText}`}
                    >
                      {isClient ? "Discover talent" : "Explore opportunities"}
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* PROFILE COMPLETION REMINDER */}
            {showProfileReminder && (
              <section
                aria-labelledby="profile-completion-heading"
                className="mt-6 rounded-3xl border border-[#dfe9df] bg-white p-5 shadow-[0_8px_25px_rgba(25,60,39,0.035)] sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                        isClient
                          ? "bg-[#edf0fc] text-[#5267a5]"
                          : "bg-[#e7f5eb] text-[#287d61]"
                      }`}
                    >
                      <UsersRound size={20} />
                    </div>
                    <div>
                      <h2
                        id="profile-completion-heading"
                        className="text-base font-semibold text-[#254536]"
                      >
                        Complete your {isClient ? "hiring" : "freelancer"} profile
                      </h2>
                      <p className="mt-1 max-w-2xl text-sm leading-6 text-[#7d8d83]">
                        {isClient
                          ? "Add a few details to help freelancers understand your company and the work you're hiring for."
                          : "Add your headline, skills and experience so clients can better understand what you offer."}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 sm:min-w-48">
                    <div className="min-w-0 flex-1 sm:w-32 sm:flex-none">
                      <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold">
                        <span className="text-[#78887e]">Profile strength</span>
                        <span className={accentText}>{profileCompletion}%</span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-[#edf1ed]"
                        role="progressbar"
                        aria-label="Profile completion"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={profileCompletion}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isClient ? "bg-[#5367a5]" : "bg-[#197d68]"
                          }`}
                          style={{ width: `${profileCompletion}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 ${primaryColor}`}
                    >
                      Complete profile
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* ROLE-SPECIFIC WORKSPACE CARDS */}
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="font-display text-2xl font-medium tracking-[-0.035em] text-[#1b332d]">
                  {isClient ? "Your hiring workspace" : "Your freelance workspace"}
                </h2>
                <p className="mt-1.5 text-sm text-[#839087]">
                  {isClient
                    ? "Everything you need to find talent and manage the work."
                    : "Everything you need to discover work and manage your business."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <Link
                      key={card.title}
                      to={card.to}
                      className="group rounded-3xl border border-[#e4ebe4] bg-white p-5 shadow-[0_4px_16px_rgba(25,60,39,0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#cadfd0] hover:shadow-[0_18px_35px_rgba(25,60,39,0.075)] sm:p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className={`grid h-12 w-12 place-items-center rounded-2xl transition duration-300 group-hover:scale-105 ${card.iconStyle}`}>
                          <Icon size={21} />
                        </div>

                        <ArrowUpRight
                          size={18}
                          className={`text-[#aab6ac] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${accentText}`}
                        />
                      </div>

                      <h3 className="mt-5 text-base font-semibold text-[#264637]">
                        {card.title}
                      </h3>

                      <p className="mt-2 min-h-[60px] text-sm leading-6 text-[#849188]">
                        {card.description}
                      </p>

                      <div className={`mt-5 flex items-center gap-2 border-t border-[#eff3ef] pt-4 text-xs font-bold ${accentText}`}>
                        {card.action}
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* PERSONALIZED NEXT STEPS */}
            <section className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-3xl border border-[#e3ebe3] bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${isClient ? "bg-[#edf0fc] text-[#5267a5]" : "bg-[#e9f5ed] text-[#338363]"}`}>
                    {isClient ? <UsersRound size={19} /> : <Sparkles size={19} />}
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-medium tracking-[-0.025em] text-[#254536]">
                      {isClient ? "Your next steps" : "Keep the momentum going"}
                    </h2>
                    <p className="mt-1 text-sm text-[#849188]">
                      {isClient
                        ? "Move from finding talent to getting work done."
                        : "Small steps to keep your freelance business moving."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 divide-y divide-[#edf1ed]">
                  {nextSteps.map((step) => {
                    const Icon = step.icon;

                    return (
                      <Link
                        key={step.title}
                        to={step.to}
                        className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f4f7f3] text-[#638773] transition group-hover:bg-[#e6f3e9]">
                          <Icon size={18} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-[#345443]">
                            {step.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#89968d]">
                            {step.description}
                          </span>
                        </span>

                        <ArrowRight
                          size={17}
                          className="shrink-0 text-[#a7b4aa] transition group-hover:translate-x-1 group-hover:text-[#197d68]"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <aside
                className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-[0_14px_35px_rgba(24,59,48,0.10)] sm:p-8 ${isClient ? "bg-[#293c68]" : "bg-[#183b30]"}`}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[28px] border-white/[0.045]"
                />

                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-[#c3e6d0]">
                    {isClient ? <Search size={20} /> : <BriefcaseBusiness size={20} />}
                  </div>

                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.17em] text-[#c0dccc]">
                    {isClient ? "HIRING TIP" : "FREELANCER TIP"}
                  </p>

                  <h2 className="mt-3 font-display text-2xl font-medium leading-tight tracking-[-0.03em]">
                    {isClient
                      ? "Clear requirements lead to better matches."
                      : "Make your services easy to understand."}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#d0dfd5]">
                    {isClient
                      ? "Describe your goals, expectations and deliverables before comparing proposals."
                      : "Clear descriptions, realistic delivery timelines and well-defined deliverables help clients understand your offer."}
                  </p>

                  <Link
                    to={isClient ? "/projects" : "/services"}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e6f4e9] px-4 py-3 text-sm font-semibold text-[#215842] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    {isClient ? "Manage projects" : "Manage services"}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </aside>
            </section>

            <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5ebe4] py-5 text-xs text-[#91a097]">
              <span>Five2Nine · Freelance. Hire. Negotiate. Work.</span>
              <span>Your work, organised in one place.</span>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
