import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../components/AppNav";
import ProfileLink from "../components/ProfileLink";
import { getProjects, createProject, getMyProjects } from "../service/projectService";
import { createProjectProposal } from "../service/proposalService";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  FolderKanban,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const categories = [
  "GRAPHICS_DESIGN",
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "DIGITAL_MARKETING",
  "WRITING_TRANSLATION",
  "VIDEO_ANIMATION",
  "AI_ML",
  "DATA_SCIENCE",
];

const categoryLabels = {
  GRAPHICS_DESIGN: "Graphics & design",
  WEB_DEVELOPMENT: "Web development",
  MOBILE_DEVELOPMENT: "Mobile development",
  DIGITAL_MARKETING: "Digital marketing",
  WRITING_TRANSLATION: "Writing & translation",
  VIDEO_ANIMATION: "Video & animation",
  AI_ML: "AI & machine learning",
  DATA_SCIENCE: "Data science",
};

const inputClass =
  "w-full rounded-xl border border-[#dfe8e0] bg-white px-4 py-3 text-sm text-[#294638] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#78b79a] focus:ring-4 focus:ring-[#e4f3e9] disabled:bg-[#f5f7f4]";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function errorText(error, fallback) {
  const data = error?.response?.data;
  return typeof data === "string" ? data : data?.message || fallback;
}

function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Budget not specified";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Projects() {
  const user = useMemo(() => readUser(), []);
  const isClient = user?.role?.toUpperCase() === "CLIENT";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    requirements: "",
    description: "",
    category: "WEB_DEVELOPMENT",
    budgetMin: "",
    budgetMax: "",
    expectedDeliveryDate: "",
  });
  const [proposalForm, setProposalForm] = useState({
    price: "",
    expectedDeliveryDate: "",
    comment: "",
  });

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = isClient ? await getMyProjects() : await getProjects();
      setProjects(Array.isArray(data) ? data : data?.content || []);
    } catch (error) {
      console.error("Failed to load projects:", error);
      setNotice({ type: "error", text: errorText(error, "Failed to load projects.") });
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const visibleProjects = projects.filter((project) => {
    const searchable = [project.title, project.description, project.requirements, project.clientName, project.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchable.includes(query.trim().toLowerCase()) &&
      (categoryFilter === "ALL" || project.category === categoryFilter);
  });

  const updateProjectForm = (field, value) => {
    setProjectForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setNotice(null);

    if (Number(projectForm.budgetMin) > Number(projectForm.budgetMax)) {
      setNotice({ type: "error", text: "Minimum budget cannot exceed maximum budget." });
      return;
    }

    setSubmitting(true);
    try {
      await createProject({
        ...projectForm,
        title: projectForm.title.trim(),
        requirements: projectForm.requirements.trim(),
        description: projectForm.description.trim(),
        budgetMin: Number(projectForm.budgetMin),
        budgetMax: Number(projectForm.budgetMax),
      });
      setProjectForm({ title: "", requirements: "", description: "", category: "WEB_DEVELOPMENT", budgetMin: "", budgetMax: "", expectedDeliveryDate: "" });
      setShowForm(false);
      setNotice({ type: "success", text: "Your project has been posted." });
      await loadProjects();
    } catch (error) {
      setNotice({ type: "error", text: errorText(error, "Failed to create project.") });
    } finally {
      setSubmitting(false);
    }
  };

  const openProposal = (project) => {
    setNotice(null);
    setSelectedProject(project);
    setProposalForm({
      price: String(project.budgetMin ?? ""),
      expectedDeliveryDate: project.expectedDeliveryDate || "",
      comment: "",
    });
  };

  const handleProposalSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProject) return;
    setSubmitting(true);
    setNotice(null);
    try {
      await createProjectProposal(selectedProject.id, {
        price: Number(proposalForm.price),
        expectedDeliveryDate: proposalForm.expectedDeliveryDate,
        comment: proposalForm.comment.trim(),
      });
      setSelectedProject(null);
      setNotice({ type: "success", text: "Your proposal has been sent to the client." });
    } catch (error) {
      setNotice({ type: "error", text: errorText(error, "Failed to send proposal.") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${isClient ? "bg-[#f6f7fb]" : "bg-[#f5f8f5]"} text-[#1b332d}`}>
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className={`mb-3 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] ${isClient ? "border-[#e0e6f6] text-[#5267a5]" : "border-[#dcebe0] text-[#287d61]"}`}>
              <Sparkles size={13} /> {isClient ? "PROJECT MANAGEMENT" : "OPPORTUNITIES FOR YOU"}
            </div>
            <h1 className="font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
              {isClient ? "My projects" : "Explore projects"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c8b81] sm:text-base">
              {isClient
                ? "Bring your ideas into focus. Post clear requirements and keep your hiring projects organised."
                : "Find client briefs that match your skills, understand the scope and submit a proposal with confidence."}
            </p>
          </div>
          {isClient && <button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-[#5367a5] px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_0_#384977] transition hover:-translate-y-0.5 hover:bg-[#43568f] active:translate-y-0">{showForm ? <X size={17} /> : <Plus size={17} />}{showForm ? "Close form" : "Post a project"}</button>}
        </section>

        {notice && <div role={notice.type === "error" ? "alert" : "status"} className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${notice.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-[#d9ebdc] bg-[#edf8ef] text-[#276848]"}`}><span className="flex-1">{notice.text}</span><button onClick={() => setNotice(null)} aria-label="Dismiss message"><X size={16} /></button></div>}

        {isClient && showForm && (
          <section className="mb-8 rounded-[26px] border border-[#e1e6f5] bg-white p-5 shadow-[0_10px_35px_rgba(48,63,112,0.05)] sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf0fc] text-[#5267a5]"><FolderKanban size={20} /></div>
              <div><h2 className="text-xl font-semibold">Post a new project</h2><p className="mt-1 text-sm text-[#829087]">Describe the outcome you need, your budget and target delivery date.</p></div>
            </div>
            <form onSubmit={handleCreateProject} className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-[#476052] md:col-span-2">Project title
                <input value={projectForm.title} onChange={(event) => updateProjectForm("title", event.target.value)} placeholder="e.g. Build a responsive e-commerce website" required maxLength={255} className={`${inputClass} mt-2`} />
              </label>
              <label className="text-sm font-semibold text-[#476052] md:col-span-2">Requirements
                <textarea value={projectForm.requirements} onChange={(event) => updateProjectForm("requirements", event.target.value)} placeholder="List the must-have features, deliverables or skills." required rows={3} className={`${inputClass} mt-2 resize-y`} />
              </label>
              <label className="text-sm font-semibold text-[#476052] md:col-span-2">Project description
                <textarea value={projectForm.description} onChange={(event) => updateProjectForm("description", event.target.value)} placeholder="Give freelancers the context they need to make a useful proposal." required rows={3} className={`${inputClass} mt-2 resize-y`} />
              </label>
              <label className="text-sm font-semibold text-[#476052]">Category
                <select value={projectForm.category} onChange={(event) => updateProjectForm("category", event.target.value)} className={`${inputClass} mt-2`}>{categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select>
              </label>
              <label className="text-sm font-semibold text-[#476052]">Target delivery date
                <input type="date" min={new Date().toISOString().slice(0, 10)} value={projectForm.expectedDeliveryDate} onChange={(event) => updateProjectForm("expectedDeliveryDate", event.target.value)} required className={`${inputClass} mt-2`} />
              </label>
              <label className="text-sm font-semibold text-[#476052]">Minimum budget (₹)
                <input type="number" min="1" step="1" value={projectForm.budgetMin} onChange={(event) => updateProjectForm("budgetMin", event.target.value)} placeholder="5000" required className={`${inputClass} mt-2`} />
              </label>
              <label className="text-sm font-semibold text-[#476052]">Maximum budget (₹)
                <input type="number" min="1" step="1" value={projectForm.budgetMax} onChange={(event) => updateProjectForm("budgetMax", event.target.value)} placeholder="15000" required className={`${inputClass} mt-2`} />
              </label>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-[#5367a5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#43568f] disabled:opacity-60">{submitting ? "Posting…" : "Publish project"}<ArrowRight size={16} /></button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-[#e0e8e0] px-5 py-3 text-sm font-semibold text-[#607468] hover:bg-[#f7faf7]">Cancel</button>
              </div>
            </form>
          </section>
        )}

        {!isClient && (
          <section className="mb-6 rounded-[24px] border border-[#dcebe0] bg-gradient-to-r from-white via-[#f4faf5] to-[#e8f4ea] p-5 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-6">
            <div className="flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#197d68] shadow-sm"><BriefcaseBusiness size={20} /></div><div><h2 className="font-semibold text-[#294638]">A good proposal starts with a clear fit.</h2><p className="mt-1 text-sm leading-6 text-[#7d8d83]">Review the scope, budget and deadline before reaching out to a client.</p></div></div>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#397b60] sm:mt-0"><CheckCircle2 size={15} /> Explore at your own pace</div>
          </section>
        )}

        <section className="rounded-[24px] border border-[#e3ebe3] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a69d]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isClient ? "Search your project list…" : "Search by project, skill or client…"} aria-label="Search projects" className={`${inputClass} pl-11`} /></div>
            <div className="relative lg:w-64"><Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a69d]" /><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter project category" className={`${inputClass} pl-10`}><option value="ALL">All categories</option>{categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select></div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf1ed] pt-4 text-xs text-[#859188]"><span>{loading ? "Loading projects…" : `${visibleProjects.length} ${visibleProjects.length === 1 ? "project" : "projects"} ${isClient ? "in your list" : "to explore"}`}</span>{(query || categoryFilter !== "ALL") && <button onClick={() => { setQuery(""); setCategoryFilter("ALL"); }} className="font-semibold text-[#5367a5] hover:underline">Clear filters</button>}</div>
        </section>

        {loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-72 animate-pulse rounded-3xl border border-[#e5ece5] bg-white" />)}</div>
        ) : visibleProjects.length === 0 ? (
          <div className="mt-6 rounded-[26px] border border-dashed border-[#d8e4d9] bg-white px-6 py-14 text-center">
            <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isClient ? "bg-[#edf0fc] text-[#5267a5]" : "bg-[#eaf5ed] text-[#478368]"}`}><FolderKanban size={23} /></div>
            <h2 className="mt-4 text-lg font-semibold text-[#2a4738]">{projects.length === 0 ? (isClient ? "Your project list is ready for an idea" : "No open projects to explore yet") : "No matching projects"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#87958b]">{projects.length === 0 ? (isClient ? "Post your first project and give freelancers a clear brief to respond to." : "There are no projects to show right now. Check back soon or try another category.") : "Try a different keyword or clear the category filter."}</p>
            {isClient && projects.length === 0 && <button onClick={() => setShowForm(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5367a5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#43568f]"><Plus size={16} /> Post your first project</button>}
            {(query || categoryFilter !== "ALL") && <button onClick={() => { setQuery(""); setCategoryFilter("ALL"); }} className="mt-5 block w-full text-sm font-semibold text-[#5367a5] hover:underline">Clear filters</button>}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <article key={project.id} className="group flex flex-col rounded-[25px] border border-[#e2e8e3] bg-white p-5 shadow-[0_5px_20px_rgba(25,60,39,0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#cad6ee] hover:shadow-[0_18px_35px_rgba(45,62,110,0.07)] sm:p-6">
                <div className="flex items-start justify-between gap-3"><span className="inline-flex rounded-full bg-[#edf0fc] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5267a5]">{categoryLabels[project.category] || project.category?.replaceAll("_", " ") || "Project"}</span><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f4f6fc] text-[#7383b5]"><FolderKanban size={18} /></span></div>
                <h2 className="mt-5 text-lg font-semibold leading-6 text-[#254536]">{project.title}</h2>
                <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-[#7e8d83]">{project.description}</p>
                {project.requirements && <div className="mt-4 rounded-xl bg-[#f7f8fc] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8790b0]">Key requirements</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7985a0]">{project.requirements}</p></div>}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf1ed] pt-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#98a49b]">{isClient ? "Your budget" : "Budget range"}</p><p className="mt-1 text-lg font-bold tracking-tight text-[#263f34]">{money(project.budgetMin)} – {money(project.budgetMax)}</p></div><div className="text-right"><p className="inline-flex items-center gap-1.5 text-xs text-[#839087]"><CalendarDays size={14} /> Deadline</p><p className="mt-1 text-xs font-semibold text-[#60766a]">{project.expectedDeliveryDate || "Not specified"}</p></div></div>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#7e8d83]"><span className="truncate">{isClient ? "Posted by you" : <>Client: <ProfileLink record={project} role="CLIENT" name={project.clientName || "Five2Nine client"} className="font-semibold text-[#60766a]" /></>}</span><span className="inline-flex shrink-0 items-center gap-1"><Clock3 size={13} /> Project brief</span></div>
                {!isClient && <button onClick={() => openProposal(project)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5367a5] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#43568f] active:translate-y-0">Send proposal <ArrowRight size={16} /></button>}
                {isClient && <Link to="/proposals" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e2e7f6] px-4 py-3 text-sm font-semibold text-[#5267a5] transition hover:bg-[#f7f8fd]">View proposals <ArrowUpRight size={16} /></Link>}
              </article>
            ))}
          </div>
        )}
      </main>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271d]/50 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) setSelectedProject(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="project-proposal-title" className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[26px] border border-white/70 bg-[#fbfcfa] p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6576b1]">MAKE YOUR OFFER</p><h2 id="project-proposal-title" className="mt-2 text-2xl font-semibold tracking-tight text-[#213e2f]">Send a proposal</h2><p className="mt-1 text-sm text-[#849188]">For: {selectedProject.title}</p></div><button type="button" disabled={submitting} onClick={() => setSelectedProject(null)} className="rounded-xl border border-[#e4ebe3] bg-white p-2 text-[#75867b] hover:bg-[#f0f6f0] disabled:opacity-50" aria-label="Close proposal"><X size={19} /></button></div>
            <form onSubmit={handleProposalSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-[#476052]">Your proposed price (₹)<input type="number" min="1" required value={proposalForm.price} onChange={(event) => setProposalForm((previous) => ({ ...previous, price: event.target.value }))} className={`${inputClass} mt-2`} /></label>
              <label className="block text-sm font-semibold text-[#476052]">Expected delivery date<input type="date" min={new Date().toISOString().slice(0, 10)} required value={proposalForm.expectedDeliveryDate} onChange={(event) => setProposalForm((previous) => ({ ...previous, expectedDeliveryDate: event.target.value }))} className={`${inputClass} mt-2`} /></label>
              <label className="block text-sm font-semibold text-[#476052]">Message to the client<textarea rows={4} value={proposalForm.comment} onChange={(event) => setProposalForm((previous) => ({ ...previous, comment: event.target.value }))} placeholder="Briefly explain how you would approach this project." className={`${inputClass} mt-2 resize-y`} /></label>
              <div className="flex flex-wrap justify-end gap-3 border-t border-[#e9eee8] pt-5"><button type="button" disabled={submitting} onClick={() => setSelectedProject(null)} className="rounded-xl border border-[#e0e8e0] px-5 py-3 text-sm font-semibold text-[#607468] hover:bg-white">Cancel</button><button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-[#5367a5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#43568f] disabled:opacity-60">{submitting ? "Sending…" : "Send proposal"}<ArrowRight size={16} /></button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
