import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  LockKeyhole,
  MapPin,
  Globe,
  Mail,
  MessageSquareText,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import AppNav from "../components/AppNav";
import { getCurrentUser, updateCurrentUserProfile } from "../service/userService";
import { getMyServices, createService, updateService, deleteService } from "../service/serviceService";
import { getMyProjects, deleteProject } from "../service/projectService";
import { getMyProposals } from "../service/proposalService";
import { getMyOrders } from "../service/orderService";

const CATEGORIES = [
  ["GRAPHICS_DESIGN", "Graphics & Design"],
  ["WEB_DEVELOPMENT", "Web Development"],
  ["MOBILE_DEVELOPMENT", "Mobile Development"],
  ["DIGITAL_MARKETING", "Digital Marketing"],
  ["WRITING_TRANSLATION", "Writing & Translation"],
  ["VIDEO_ANIMATION", "Video & Animation"],
  ["AI_ML", "AI & Machine Learning"],
  ["DATA_SCIENCE", "Data Science"],
];

const EMPTY_SERVICE = {
  title: "",
  description: "",
  category: "WEB_DEVELOPMENT",
  price: "",
  deliveryDays: "",
};

function readError(error, fallback) {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  return data?.message || error?.message || fallback;
}

function initials(name = "Five2Nine member") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "F2";
}

function formatDate(value) {
  if (!value) return "Date not specified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function formatCategory(category) {
  return CATEGORIES.find(([value]) => value === category)?.[1] || String(category || "General").replaceAll("_", " ");
}

function TabButton({ active, icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-[#1b3d31] text-white shadow-[0_4px_0_#112d23]" : "text-[#6f8177] hover:bg-white hover:text-[#244936]"}`}
      aria-pressed={active}
    >
      <Icon size={16} />
      {children}
    </button>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#43836a]">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-medium tracking-[-0.035em] text-[#1b332d] sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7d8d83]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text", required = false, min, max, autoComplete, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[#52695d]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full rounded-xl border border-[#dfe8df] bg-white px-4 py-3 text-sm text-[#244236] outline-none transition placeholder:text-[#a1ada4] focus:border-[#67a989] focus:ring-4 focus:ring-[#dff1e5] disabled:cursor-not-allowed disabled:bg-[#f2f5f1] disabled:text-[#87958b]"
      />
    </label>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workLoading, setWorkLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState(null);

  const [profileDraft, setProfileDraft] = useState({
    headline: "", bio: "", location: "", website: "", skills: "",
    experience: "", companyName: "", companyRole: "", hiringFocus: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [serviceEditorOpen, setServiceEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);


  const role = user?.role?.toUpperCase();
  const isClient = role === "CLIENT";
  const name = user?.name?.trim() || "Five2Nine member";
  const firstName = name.split(/\s+/)[0];
  const avatarText = useMemo(() => initials(name), [name]);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      setLoading(true);
      setPageError("");
      try {
        const currentUser = await getCurrentUser();
        if (!active) return;
        setUser(currentUser);
        // Profile fields now come from the backend; browser-only drafts are no longer the source of truth.
        setProfileDraft({
          headline: currentUser?.headline || "",
          bio: currentUser?.bio || "",
          location: currentUser?.location || "",
          website: currentUser?.website || "",
          skills: currentUser?.skills || "",
          experience: currentUser?.experience || "",
          companyName: currentUser?.companyName || "",
          companyRole: currentUser?.companyRole || "",
          hiringFocus: currentUser?.hiringFocus || "",
        });

        const [workResult, proposalResult, orderResult] = await Promise.allSettled([
          currentUser?.role?.toUpperCase() === "CLIENT" ? getMyProjects() : getMyServices(),
          getMyProposals(),
          getMyOrders(),
        ]);

        if (!active) return;
        if (workResult.status === "fulfilled") {
          if (currentUser?.role?.toUpperCase() === "CLIENT") setProjects(Array.isArray(workResult.value) ? workResult.value : []);
          else setServices(Array.isArray(workResult.value) ? workResult.value : []);
        }
        if (proposalResult.status === "fulfilled") setProposals(Array.isArray(proposalResult.value) ? proposalResult.value : []);
        if (orderResult.status === "fulfilled") setOrders(Array.isArray(orderResult.value) ? orderResult.value : []);

        const failures = [workResult, proposalResult, orderResult].filter((result) => result.status === "rejected");
        if (failures.length) {
          setNotice({ type: "warning", text: "Some workspace activity could not be loaded. Account details are available; try refreshing if a section is empty." });
        }
      } catch (error) {
        console.error("Profile load failed:", error);
        if (active) setPageError(readError(error, "We couldn't load your profile. Please sign in again and retry."));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPage();
    return () => { active = false; };
  }, []);

  const refreshWork = async () => {
    setWorkLoading(true);
    try {
      if (isClient) {
        const data = await getMyProjects();
        setProjects(Array.isArray(data) ? data : []);
      } else {
        const data = await getMyServices();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setNotice({ type: "error", text: readError(error, "Couldn't refresh your work. Please try again.") });
    } finally {
      setWorkLoading(false);
    }
  };

  const openCreateService = () => {
    setEditingService(null);
    setServiceForm(EMPTY_SERVICE);
    setNotice(null);
    setServiceEditorOpen(true);
  };

  const openEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title || "",
      description: service.description || "",
      category: service.category || "WEB_DEVELOPMENT",
      price: String(service.price ?? ""),
      deliveryDays: String(service.deliveryDays ?? ""),
    });
    setNotice(null);
    setServiceEditorOpen(true);
  };

  const submitService = async (event) => {
    event.preventDefault();
    setServiceSaving(true);
    setNotice(null);
    const payload = {
      ...serviceForm,
      title: serviceForm.title.trim(),
      description: serviceForm.description.trim(),
      price: Number(serviceForm.price),
      deliveryDays: Number(serviceForm.deliveryDays),
    };

    try {
      if (editingService) await updateService(editingService.id, payload);
      else await createService(payload);
      setServiceEditorOpen(false);
      setNotice({ type: "success", text: editingService ? "Service updated successfully." : "Service created successfully." });
      await refreshWork();
    } catch (error) {
      setNotice({ type: "error", text: readError(error, "We couldn't save this service.") });
    } finally {
      setServiceSaving(false);
    }
  };

  const removeWorkItem = async (item) => {
    const label = isClient ? "project" : "service";
    if (!window.confirm(`Delete this ${label}? This action cannot be undone.`)) return;
    setDeletingId(item.id);
    setNotice(null);
    try {
      if (isClient) {
        await deleteProject(item.id);
        setProjects((current) => current.filter((project) => project.id !== item.id));
      } else {
        await deleteService(item.id);
        setServices((current) => current.filter((service) => service.id !== item.id));
      }
      setNotice({ type: "success", text: `${isClient ? "Project" : "Service"} deleted successfully.` });
    } catch (error) {
      setNotice({ type: "error", text: readError(error, `We couldn't delete this ${label}.`) });
    } finally {
      setDeletingId(null);
    }
  };

  const saveProfileDraft = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    setNotice(null);
    try {
      const savedProfile = await updateCurrentUserProfile(profileDraft);
      setUser((current) => ({ ...current, ...savedProfile }));
      setProfileDraft({
        headline: savedProfile?.headline || "",
        bio: savedProfile?.bio || "",
        location: savedProfile?.location || "",
        website: savedProfile?.website || "",
        skills: savedProfile?.skills || "",
        experience: savedProfile?.experience || "",
        companyName: savedProfile?.companyName || "",
        companyRole: savedProfile?.companyRole || "",
        hiringFocus: savedProfile?.hiringFocus || "",
      });
      setNotice({ type: "success", text: `Profile saved to Five2Nine. Your profile is ${savedProfile?.completionPercent ?? 0}% complete.` });
    } catch (error) {
      setNotice({ type: "error", text: readError(error, "We couldn't save your profile. Please try again.") });
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfileDraft = (field, value) => {
    setProfileDraft((current) => ({ ...current, [field]: value }));
  };

  const completionPercent = Number.isFinite(Number(user?.completionPercent))
    ? Math.max(0, Math.min(100, Number(user.completionPercent)))
    : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: CircleUserRound },
    { id: "profile", label: "Public profile", icon: UserRound },
    { id: "work", label: isClient ? "My Projects" : "My Services", icon: BriefcaseBusiness },
    { id: "activity", label: "Activity", icon: MessageSquareText },
    { id: "security", label: "Account & Security", icon: LockKeyhole },
  ];

  const workItems = isClient ? projects : services;

  return (
    <div className={`min-h-screen ${isClient ? "bg-[#f6f7fb]" : "bg-[#f5f8f5]"} text-[#1b332d]`}>
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {loading ? (
          <div role="status" className="animate-pulse space-y-5">
            <div className="h-8 w-60 rounded-lg bg-[#e1e9e1]" />
            <div className="h-48 rounded-[28px] bg-white" />
            <div className="h-96 rounded-[28px] bg-white" />
            <span className="sr-only">Loading your profile...</span>
          </div>
        ) : pageError ? (
          <div role="alert" className="rounded-3xl border border-rose-200 bg-white p-8 text-center">
            <h1 className="text-xl font-semibold">Profile unavailable</h1>
            <p className="mt-2 text-sm text-[#7d8d83]">{pageError}</p>
            <button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white">Try again</button>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={`mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] ${isClient ? "text-[#5267a5]" : "text-[#43836a]"}`}>
                  <Sparkles size={14} /> YOUR ACCOUNT
                </p>
                <h1 className="font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">Profile & settings</h1>
                <p className="mt-2 text-sm leading-6 text-[#7d8d83]">Manage your identity, your work and your account preferences.</p>
              </div>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-[#dfe8df] bg-white px-4 py-2.5 text-sm font-semibold text-[#476451] transition hover:-translate-y-0.5 hover:shadow-sm">
                Back to dashboard <ArrowUpRight size={15} />
              </Link>
            </div>

            {notice && (
              <div role={notice.type === "error" ? "alert" : "status"} className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${notice.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : notice.type === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-[#d7eadb] bg-[#eef8f0] text-[#286849]"}`}>
                {notice.type === "error" ? <X size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
                <span>{notice.text}</span>
                <button type="button" onClick={() => setNotice(null)} className="ml-auto rounded-md p-0.5 opacity-70 hover:opacity-100" aria-label="Dismiss message"><X size={15} /></button>
              </div>
            )}

            {/* Profile identity banner */}
            <section className={`relative overflow-hidden rounded-[28px] border border-[#e0e9df] bg-gradient-to-br ${isClient ? "from-white via-[#f6f7fd] to-[#e9edfa]" : "from-white via-[#f3faf5] to-[#e0f2e6]"} p-6 shadow-[0_16px_45px_rgba(37,82,57,0.055)] sm:p-8`}>
              <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[34px] border-white/50" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className={`grid h-24 w-24 shrink-0 place-items-center rounded-[28px] text-2xl font-bold shadow-inner ring-4 ring-white/80 ${isClient ? "bg-gradient-to-br from-[#e4e9fb] to-[#cbd5f7] text-[#455a99]" : "bg-gradient-to-br from-[#d7eee0] to-[#b8dfc8] text-[#1a644e]"}`}>
                  {avatarText}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl font-medium tracking-[-0.035em] sm:text-3xl">{name}</h2>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${isClient ? "bg-[#edf0fc] text-[#5267a5]" : "bg-[#e7f5eb] text-[#197d68]"}`}>{isClient ? "Client" : "Freelancer"}</span>
                  </div>
                  <p className="mt-2 break-all text-sm text-[#78887e]">{user?.email}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#708277]">{isClient ? "Your hiring identity: keep your account details current and manage the projects you publish." : "Your professional workspace: manage service listings, track proposals and keep your account information up to date."}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:min-w-[250px]">
                  <div className="rounded-2xl border border-white/90 bg-white/80 p-3 text-center shadow-sm">
                    <p className="text-xl font-semibold text-[#244536]">{workItems.length}</p>
                    <p className="mt-1 text-[10px] font-semibold text-[#829188]">{isClient ? "Projects" : "Services"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/90 bg-white/80 p-3 text-center shadow-sm">
                    <p className="text-xl font-semibold text-[#244536]">{proposals.length}</p>
                    <p className="mt-1 text-[10px] font-semibold text-[#829188]">Proposals</p>
                  </div>
                  <div className="rounded-2xl border border-white/90 bg-white/80 p-3 text-center shadow-sm">
                    <p className="text-xl font-semibold text-[#244536]">{orders.length}</p>
                    <p className="mt-1 text-[10px] font-semibold text-[#829188]">Orders</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <div className="mt-7 overflow-x-auto rounded-2xl border border-[#e4ebe4] bg-[#edf2ec] p-1.5">
              <div className="flex min-w-max gap-1">
                {tabs.map((tab) => <TabButton key={tab.id} active={activeTab === tab.id} icon={tab.icon} onClick={() => { setActiveTab(tab.id); setNotice(null); }}>{tab.label}</TabButton>)}
              </div>
            </div>

            {activeTab === "overview" && (
              <section className="mt-8 space-y-5">
                <div className="rounded-3xl border border-[#dce9de] bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#43836a]">PROFILE COMPLETION</p>
                      <h2 className="mt-2 text-lg font-semibold text-[#244536]">{completionPercent === 100 ? "Your profile is complete" : "Complete your profile to improve your visibility"}</h2>
                      <p className="mt-1 text-sm text-[#7d8d83]">Optional details help people understand who you are. You can use Five2Nine even if your profile isn't complete.</p>
                    </div>
                    <div className="text-right"><p className="text-3xl font-bold text-[#197d68]">{completionPercent}%</p><button type="button" onClick={() => setActiveTab("profile")} className="mt-1 text-xs font-semibold text-[#39745c] hover:underline">{completionPercent === 100 ? "Review profile" : "Complete profile →"}</button></div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eaf1e9]" role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completionPercent}><div className="h-full rounded-full bg-[#197d68] transition-all" style={{ width: `${completionPercent}%` }} /></div>
                </div>
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-[#e3ebe3] bg-white p-6 shadow-sm sm:p-8">
                  <SectionHeading eyebrow="ACCOUNT OVERVIEW" title="Your details" description="The key information linked to your Five2Nine account." action={<button onClick={() => setActiveTab("security")} className="inline-flex items-center gap-2 rounded-xl border border-[#e0e9df] px-3 py-2 text-xs font-semibold text-[#47705a] hover:bg-[#f5faf5]">Edit details <ArrowRight size={14} /></button>} />
                  <div className="divide-y divide-[#edf1ed]">
                    <div className="flex items-center gap-4 py-4 first:pt-0"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1f6f1] text-[#60806b]"><UserRound size={18}/></span><div className="min-w-0"><p className="text-xs text-[#87958b]">Full name</p><p className="mt-1 break-words text-sm font-semibold text-[#2c4939]">{user?.name || "Not set"}</p></div></div>
                    <div className="flex items-center gap-4 py-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1f6f1] text-[#60806b]"><Mail size={18}/></span><div className="min-w-0"><p className="text-xs text-[#87958b]">Email address</p><p className="mt-1 break-all text-sm font-semibold text-[#2c4939]">{user?.email || "Not set"}</p></div></div>
                    <div className="flex items-center gap-4 py-4 last:pb-0"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1f6f1] text-[#60806b]"><ShieldCheck size={18}/></span><div className="min-w-0"><p className="text-xs text-[#87958b]">Account type</p><p className="mt-1 text-sm font-semibold text-[#2c4939]">{isClient ? "Client / Hiring account" : "Freelancer / Service provider"}</p></div></div>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#1b3d31] p-6 text-white shadow-[0_14px_35px_rgba(24,59,48,0.12)] sm:p-8">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-[#c0e6ce]"><Sparkles size={20}/></div>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[#b4d9c1]">YOUR NEXT STEP</p>
                  <h3 className="mt-3 font-display text-2xl font-medium leading-tight">{isClient ? "Keep your hiring organised." : "Make your services work harder."}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#cfdfd4]">{isClient ? "Review your projects and proposals regularly to keep the right work moving." : "Keep your service descriptions, pricing and delivery expectations accurate for potential clients."}</p>
                  <button onClick={() => setActiveTab("work")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e6f4e9] px-4 py-3 text-sm font-semibold text-[#215842] transition hover:-translate-y-0.5 hover:bg-white">{isClient ? "View my projects" : "Manage my services"}<ArrowRight size={15}/></button>
                </div>
                </div>
              </section>
            )}

            {activeTab === "work" && (
              <section className="mt-8">
                <SectionHeading
                  eyebrow={isClient ? "HIRING WORKSPACE" : "YOUR OFFERINGS"}
                  title={isClient ? "My projects" : "My services"}
                  description={isClient ? "Review the project posts created by your account. Project editing is not available in the current backend yet." : "Create, update and remove the services you publish on Five2Nine."}
                  action={isClient ? <Link to="/projects" className="inline-flex items-center gap-2 rounded-xl bg-[#5367a5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#43568f]"><Plus size={16}/> Create project</Link> : <button onClick={openCreateService} className="inline-flex items-center gap-2 rounded-xl bg-[#197d68] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_0_#115a49] transition hover:-translate-y-0.5 hover:bg-[#146957]"><Plus size={16}/> Create service</button>}
                />

                {workLoading ? <div className="rounded-2xl border border-[#e3ebe3] bg-white p-8 text-sm text-[#7d8d83]">Refreshing your work…</div> : workItems.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[#d5e2d6] bg-white p-10 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eaf5ed] text-[#43836a]"><BriefcaseBusiness size={23}/></div>
                    <h3 className="mt-4 text-lg font-semibold text-[#2c4939]">{isClient ? "No projects yet" : "No services published yet"}</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#819087]">{isClient ? "Create your first project when you're ready to hire a freelancer." : "Add your first service to show clients what you can help them with."}</p>
                    {isClient ? <Link to="/projects" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5367a5] px-4 py-3 text-sm font-semibold text-white">Create a project <ArrowRight size={15}/></Link> : <button onClick={openCreateService} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#197d68] px-4 py-3 text-sm font-semibold text-white">Create a service <ArrowRight size={15}/></button>}
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {workItems.map((item) => (
                      <article key={item.id} className="group flex flex-col rounded-3xl border border-[#e2eae2] bg-white p-5 shadow-[0_4px_16px_rgba(25,60,39,0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#cadfd0] hover:shadow-[0_18px_35px_rgba(25,60,39,0.07)] sm:p-6">
                        <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-[#eaf5ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#267857]">{formatCategory(item.category)}</span>{item.status && <span className="rounded-full bg-[#f3f5f2] px-2.5 py-1 text-[10px] font-semibold text-[#728176]">{item.status}</span>}</div>
                        <h3 className="mt-4 text-lg font-semibold leading-snug text-[#274637]">{item.title || "Untitled work"}</h3>
                        <p className="mt-2 line-clamp-4 flex-1 text-sm leading-6 text-[#7f8d83]">{item.description || item.requirements || "No description added yet."}</p>
                        <div className="mt-5 flex items-end justify-between border-t border-[#edf1ed] pt-4"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-[#97a299]">{isClient ? "Budget range" : "Starting price"}</p><p className="mt-1 text-lg font-bold text-[#224635]">{isClient ? `₹${item.budgetMin ?? "—"} – ₹${item.budgetMax ?? "—"}` : `₹${item.price ?? "—"}`}</p></div><div className="text-right"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#97a299]">{isClient ? "Deadline" : "Delivery"}</p><p className="mt-1 text-xs font-semibold text-[#5e7567]">{isClient ? formatDate(item.expectedDeliveryDate) : `${item.deliveryDays ?? "—"} days`}</p></div></div>
                        <div className="mt-4 flex gap-2">
                          {isClient ? <button type="button" disabled={deletingId === item.id} onClick={() => removeWorkItem(item)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"><Trash2 size={14}/>{deletingId === item.id ? "Deleting…" : "Delete project"}</button> : <><button type="button" onClick={() => openEditService(item)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#dce8dd] px-3 py-2.5 text-xs font-semibold text-[#39745c] transition hover:bg-[#f2f8f2]"><ArrowDownRight size={14}/> Edit service</button><button type="button" disabled={deletingId === item.id} onClick={() => removeWorkItem(item)} aria-label={`Delete ${item.title}`} className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-3 py-2.5 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"><Trash2 size={14}/></button></>}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === "activity" && (
              <section className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-[#e3ebe3] bg-white p-6 shadow-sm sm:p-7">
                  <SectionHeading eyebrow="NEGOTIATIONS" title="Recent proposals" description="Offers and work requests associated with your account." />
                  {proposals.length === 0 ? <p className="rounded-2xl bg-[#f7f9f6] p-5 text-sm text-[#819087]">No proposals to show yet.</p> : <div className="space-y-3">{proposals.slice(0, 6).map((proposal) => <div key={proposal.id} className="rounded-2xl border border-[#e8eee8] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[#43836a]">{proposal.source || "Proposal"}</p><h3 className="mt-1 font-semibold text-[#2c4939]">{proposal.serviceTitle || proposal.projectTitle || "Custom work"}</h3></div><span className="rounded-full bg-[#f0f4ef] px-2.5 py-1 text-[10px] font-bold text-[#6b7c70]">{proposal.status || "OPEN"}</span></div><div className="mt-3 flex items-center justify-between text-xs text-[#829188]"><span>₹{proposal.price ?? "—"}</span><span>{formatDate(proposal.expectedDeliveryDate)}</span></div></div>)}</div>}
                  <Link to="/proposals" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#39745c] hover:underline">Open all proposals <ArrowRight size={15}/></Link>
                </div>
                <div className="rounded-3xl border border-[#e3ebe3] bg-white p-6 shadow-sm sm:p-7">
                  <SectionHeading eyebrow="COMMITMENTS" title="Recent orders" description="Accepted work and current commitments." />
                  {orders.length === 0 ? <p className="rounded-2xl bg-[#f7f9f6] p-5 text-sm text-[#819087]">No orders to show yet.</p> : <div className="space-y-3">{orders.slice(0, 6).map((order) => <div key={order.id} className="rounded-2xl border border-[#e8eee8] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[#43836a]">ORDER #{order.id}</p><h3 className="mt-1 font-semibold text-[#2c4939]">{order.serviceTitle || order.projectTitle || "Custom work"}</h3></div><span className="rounded-full bg-[#eaf5ed] px-2.5 py-1 text-[10px] font-bold text-[#287d61]">{order.status || "ACTIVE"}</span></div><div className="mt-3 flex items-center justify-between text-xs text-[#829188]"><span>₹{order.agreedPrice ?? "—"}</span><span className="inline-flex items-center gap-1"><Clock3 size={13}/>{formatDate(order.agreedDeliveryDate)}</span></div></div>)}</div>}
                  <Link to="/orders" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#39745c] hover:underline">Open all orders <ArrowRight size={15}/></Link>
                </div>
              </section>
            )}

            {activeTab === "profile" && (
              <section className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className={`h-fit rounded-3xl border p-6 shadow-sm sm:p-8 ${isClient ? "border-[#e1e6f6] bg-gradient-to-br from-white to-[#f0f2fc]" : "border-[#dce9de] bg-gradient-to-br from-white to-[#edf8f0]"}`}>
                  <div className={`grid h-16 w-16 place-items-center rounded-2xl text-xl font-bold shadow-sm ring-4 ring-white ${isClient ? "bg-[#dfe5fb] text-[#4e61a0]" : "bg-[#d8efdf] text-[#247052]"}`}>{avatarText}</div>
                  <h2 className="mt-5 font-display text-2xl font-medium tracking-tight">{name}</h2>
                  <p className={`mt-2 text-sm font-semibold ${isClient ? "text-[#5267a5]" : "text-[#287d61]"}`}>{isClient ? (profileDraft.companyRole || "Client / Hiring account") : (profileDraft.headline || "Add a professional headline")}</p>
                  <p className="mt-4 text-sm leading-6 text-[#77877d]">{profileDraft.bio || (isClient ? "Tell freelancers about your organisation, the kind of work you hire for, and how you like to collaborate." : "Introduce yourself, your strengths and the value you bring to clients.")}</p>
                  {profileDraft.location && <p className="mt-4 flex items-center gap-2 text-sm text-[#6f8177]"><MapPin size={15}/>{profileDraft.location}</p>}
                  {profileDraft.website && <p className="mt-2 flex items-center gap-2 break-all text-sm text-[#6f8177]"><Globe size={15}/>{profileDraft.website}</p>}
                  <div className="mt-5 rounded-2xl border border-white bg-white/80 p-4 text-xs leading-5 text-[#7d8d83]">
                    <p className="font-semibold text-[#486252]">Public profile preview</p>
                    <p className="mt-1">Only the details you fill in will be shown on your public profile. Your email and account security details are never displayed publicly.</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#e3ebe3] bg-white p-6 shadow-sm sm:p-8">
                  <SectionHeading eyebrow={isClient ? "HIRING IDENTITY" : "PROFESSIONAL IDENTITY"} title={isClient ? "About your work" : "Tell clients about yourself"} description={isClient ? "Help freelancers understand your organisation and the kind of projects you post." : "A clear profile helps clients understand your skills, experience and working style."} />
                  <form onSubmit={saveProfileDraft} className="space-y-5">
                    {!isClient && <FormField label="Professional headline" value={profileDraft.headline} onChange={(event) => updateProfileDraft("headline", event.target.value)} placeholder="e.g. Full-stack developer | React & Spring Boot" />}
                    {isClient && <><FormField label="Company / organisation (optional)" value={profileDraft.companyName} onChange={(event) => updateProfileDraft("companyName", event.target.value)} placeholder="Your company or organisation" /><FormField label="Your role (optional)" value={profileDraft.companyRole} onChange={(event) => updateProfileDraft("companyRole", event.target.value)} placeholder="e.g. Founder, Marketing Manager" /></>}
                    <label className="block"><span className="mb-2 block text-xs font-semibold text-[#52695d]">{isClient ? "About you / your organisation" : "Professional bio"}</span><textarea value={profileDraft.bio} onChange={(event) => updateProfileDraft("bio", event.target.value)} placeholder={isClient ? "What does your organisation do? What kind of work do you usually need help with?" : "Introduce yourself, your experience, what you specialise in and what clients can expect…"} maxLength={isClient ? 1200 : 1000} rows={5} className="w-full resize-y rounded-xl border border-[#dfe8df] bg-white px-4 py-3 text-sm leading-6 text-[#244236] outline-none transition placeholder:text-[#a1ada4] focus:border-[#67a989] focus:ring-4 focus:ring-[#dff1e5]"/><span className="mt-1 block text-right text-[11px] text-[#94a096]">{profileDraft.bio.length}/{isClient ? 1200 : 1000}</span></label>
                    <div className="grid gap-4 sm:grid-cols-2"><FormField label="Location (optional)" value={profileDraft.location} onChange={(event) => updateProfileDraft("location", event.target.value)} placeholder="e.g. Mumbai, India"/><FormField label="Website / portfolio (optional)" value={profileDraft.website} onChange={(event) => updateProfileDraft("website", event.target.value)} placeholder="https://…" type="url"/></div>
                    {!isClient ? <><label className="block"><span className="mb-2 block text-xs font-semibold text-[#52695d]">Skills (comma-separated)</span><textarea value={profileDraft.skills} onChange={(event) => updateProfileDraft("skills", event.target.value)} placeholder="React, Java, Spring Boot, UI design…" rows={3} className="w-full rounded-xl border border-[#dfe8df] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#67a989] focus:ring-4 focus:ring-[#dff1e5]"/></label><label className="block"><span className="mb-2 block text-xs font-semibold text-[#52695d]">Experience level</span><select value={profileDraft.experience} onChange={(event) => updateProfileDraft("experience", event.target.value)} className="w-full rounded-xl border border-[#dfe8df] bg-white px-4 py-3 text-sm outline-none focus:border-[#67a989] focus:ring-4 focus:ring-[#dff1e5]"><option value="">Choose an experience level</option><option value="BEGINNER">Entry level</option><option value="INTERMEDIATE">Intermediate</option><option value="EXPERT">Expert</option></select></label></> : <label className="block"><span className="mb-2 block text-xs font-semibold text-[#52695d]">Typical hiring needs (optional)</span><textarea value={profileDraft.hiringFocus} onChange={(event) => updateProfileDraft("hiringFocus", event.target.value)} placeholder="e.g. Websites, design support, data dashboards…" rows={3} className="w-full rounded-xl border border-[#dfe8df] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#67a989] focus:ring-4 focus:ring-[#dff1e5]"/></label>}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7eee6] pt-5"><p className="max-w-sm text-xs leading-5 text-[#87958b]">All fields are optional. Your changes are saved to your Five2Nine account when you press Save profile.</p><button type="submit" disabled={profileSaving} className="inline-flex items-center gap-2 rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_0_#115a49] transition hover:-translate-y-0.5 hover:bg-[#146957] disabled:cursor-not-allowed disabled:opacity-60"><Save size={16}/>{profileSaving ? "Saving…" : "Save profile"}</button></div>
                  </form>
                </div>
              </section>
            )}

            {activeTab === "security" && (
              <section className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-[#e3ebe3] bg-white p-6 shadow-sm sm:p-8">
                  <SectionHeading eyebrow="ACCOUNT INFORMATION" title="Sign-in details" description="These details come from your Five2Nine account." />
                  <div className="space-y-4"><div className="flex items-center gap-3 rounded-2xl bg-[#f7f9f6] p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#60806b]"><Mail size={18}/></span><div className="min-w-0"><p className="text-xs text-[#87958b]">Email address</p><p className="mt-1 break-all text-sm font-semibold text-[#2c4939]">{user?.email || "Not available"}</p></div></div><div className="flex items-start gap-3 rounded-2xl border border-[#e2eae2] p-4"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#43836a]"/><p className="text-sm leading-6 text-[#718278]">Email changes will require a verified flow. We won't expose a direct email editor until backend verification is implemented.</p></div></div>
                </div>
                <div className="rounded-3xl border border-[#e3ebe3] bg-white p-6 shadow-sm sm:p-8">
                  <SectionHeading eyebrow="ACCOUNT SECURITY" title="Password recovery" description="Need to secure your account or can't remember your password?" />
                  <div className="rounded-2xl bg-[#f7f9f6] p-5"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#43836a] shadow-sm"><LockKeyhole size={20}/></div><h3 className="mt-4 font-semibold text-[#345443]">Reset your password securely</h3><p className="mt-2 text-sm leading-6 text-[#7d8d83]">We'll use the existing email-based password reset flow rather than changing passwords directly from the profile page.</p><Link to="/forgot-password" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1b3d31] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#143226]">Go to password reset <ArrowRight size={15}/></Link></div>
                </div>
                <div className="lg:col-span-2 rounded-3xl border border-[#e2eae2] bg-[#f7faf6] p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#4d7d61] shadow-sm"><ShieldCheck size={19}/></span><div><h3 className="text-sm font-semibold text-[#345443]">Account safety</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-[#7d8d83]">Your password is never displayed on this page. Password changes continue through the existing reset-link flow; profile fields will be saved to the server once the backend profile model is ready.</p></div></div></div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Create / edit service modal */}
      {serviceEditorOpen && !isClient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#10251c]/45 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !serviceSaving) setServiceEditorOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="service-editor-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/70 bg-[#fbfcf9] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#43836a]">SERVICE MANAGEMENT</p><h2 id="service-editor-title" className="mt-2 font-display text-2xl font-medium text-[#1b332d]">{editingService ? "Edit service" : "Create a new service"}</h2><p className="mt-2 text-sm leading-6 text-[#7d8d83]">Describe what you offer and set clear delivery expectations.</p></div><button type="button" onClick={() => setServiceEditorOpen(false)} disabled={serviceSaving} className="rounded-xl p-2 text-[#74857a] transition hover:bg-[#eaf1e9]" aria-label="Close service form"><X size={20}/></button></div>
            <form onSubmit={submitService} className="mt-7 space-y-5">
              <FormField label="Service title" value={serviceForm.title} onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })} placeholder="e.g. Responsive React website" required />
              <label className="block"><span className="mb-2 block text-xs font-semibold text-[#52695d]">Category</span><select value={serviceForm.category} onChange={(event) => setServiceForm({ ...serviceForm, category: event.target.value })} className="w-full rounded-xl border border-[#dfe8df] bg-white px-4 py-3 text-sm outline-none focus:border-[#67a989] focus:ring-4 focus:ring-[#dff1e5]">{CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="block"><span className="mb-2 block text-xs font-semibold text-[#52695d]">Description</span><textarea value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} placeholder="Explain the deliverables, scope and what the client will receive…" required maxLength={1000} rows={5} className="w-full resize-y rounded-xl border border-[#dfe8df] bg-white px-4 py-3 text-sm leading-6 text-[#244236] outline-none transition placeholder:text-[#a1ada4] focus:border-[#67a989] focus:ring-4 focus:ring-[#dff1e5]"/><span className="mt-1 block text-right text-[11px] text-[#94a096]">{serviceForm.description.length}/1000</span></label>
              <div className="grid gap-4 sm:grid-cols-2"><FormField label="Price (₹)" type="number" min="1" value={serviceForm.price} onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })} placeholder="5000" required/><FormField label="Delivery time (days)" type="number" min="1" value={serviceForm.deliveryDays} onChange={(event) => setServiceForm({ ...serviceForm, deliveryDays: event.target.value })} placeholder="7" required/></div>
              <div className="flex flex-wrap justify-end gap-3 border-t border-[#e7eee6] pt-5"><button type="button" disabled={serviceSaving} onClick={() => setServiceEditorOpen(false)} className="rounded-xl border border-[#dce7dc] px-4 py-3 text-sm font-semibold text-[#5d7566] hover:bg-[#f1f6ef]">Cancel</button><button type="submit" disabled={serviceSaving} className="inline-flex items-center gap-2 rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_0_#115a49] transition hover:-translate-y-0.5 disabled:opacity-60">{serviceSaving ? "Saving…" : <><Save size={16}/>{editingService ? "Save changes" : "Publish service"}</>}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
