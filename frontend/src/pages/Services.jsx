import { useCallback, useEffect, useMemo, useState } from "react";
import AppNav from "../components/AppNav";
import {
  getServices,
  createService,
  getMyServices,
} from "../service/serviceService";
import { createServiceProposal } from "../service/proposalService";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Code2,
  FileUp,
  Filter,
  Image,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import ProfileLink from "../components/ProfileLink";

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

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;
  return typeof data === "string" ? data : data?.message || fallback;
}

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Services() {
  const user = useMemo(() => readUser(), []);
  const role = user?.role?.toUpperCase();
  const isFreelancer = role === "FREELANCER";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    category: "WEB_DEVELOPMENT",
    price: "",
    deliveryDays: "",
  });
  const [proposalForm, setProposalForm] = useState({
    requirements: "",
    description: "",
    price: "",
    expectedDeliveryDate: "",
    comment: "",
    attachmentName: "",
    attachmentType: "",
    attachmentSize: "",
  });

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = isFreelancer
        ? await getMyServices()
        : await getServices({ page: 0, size: 50, sort: "createdAt,desc" });
      setServices(Array.isArray(data) ? data : data?.content || []);
    } catch (error) {
      console.error("Failed to load services:", error);
      setNotice({ type: "error", text: getErrorMessage(error, "Failed to load services.") });
    } finally {
      setLoading(false);
    }
  }, [isFreelancer]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filteredServices = services.filter((service) => {
    const searchable = [service.title, service.description, service.freelancerName, service.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery = searchable.includes(query.trim().toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || service.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const handleServiceChange = (event) => {
    const { name, value } = event.target;
    setServiceForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleCreateService = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);

    try {
      await createService({
        ...serviceForm,
        title: serviceForm.title.trim(),
        description: serviceForm.description.trim(),
        price: Number(serviceForm.price),
        deliveryDays: Number(serviceForm.deliveryDays),
      });
      setServiceForm({ title: "", description: "", category: "WEB_DEVELOPMENT", price: "", deliveryDays: "" });
      setShowCreateForm(false);
      setNotice({ type: "success", text: "Your service has been published." });
      await loadServices();
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error, "Failed to create service.") });
    } finally {
      setSubmitting(false);
    }
  };

  const openProposal = (service) => {
    setNotice(null);
    setSelectedService(service);
    setProposalForm({
      requirements: "",
      description: "",
      price: String(service.price ?? ""),
      expectedDeliveryDate: "",
      comment: "",
      attachmentName: "",
      attachmentType: "",
      attachmentSize: "",
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProposalForm((previous) => ({
      ...previous,
      attachmentName: file.name,
      attachmentType: file.type,
      attachmentSize: file.size,
    }));
  };

  const handleProposalSubmit = async (event) => {
    event.preventDefault();
    if (!selectedService) return;
    setSubmitting(true);
    setNotice(null);

    try {
      await createServiceProposal(selectedService.id, {
        requirements: proposalForm.requirements.trim(),
        description: proposalForm.description.trim(),
        price: Number(proposalForm.price),
        expectedDeliveryDate: proposalForm.expectedDeliveryDate,
        comment: proposalForm.comment.trim(),
        attachmentName: proposalForm.attachmentName || null,
        attachmentType: proposalForm.attachmentType || null,
        attachmentSize: proposalForm.attachmentSize ? Number(proposalForm.attachmentSize) : null,
        attachmentUrl: null,
      });
      setSelectedService(null);
      setNotice({ type: "success", text: "Your work request has been sent." });
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error, "Failed to send the work request.") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#1b332d]">
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] ${isFreelancer ? "border-[#dcebe0] bg-white text-[#287d61]" : "border-[#e0e6f6] bg-white text-[#5267a5]"}`}>
              <Sparkles size={13} /> {isFreelancer ? "YOUR OFFERINGS" : "FIND YOUR NEXT PARTNER"}
            </div>
            <h1 className="font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
              {isFreelancer ? "My services" : "Discover services"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c8b81] sm:text-base">
              {isFreelancer
                ? "Present your skills clearly, manage your listings and make it easy for clients to choose you."
                : "Explore specialist services, compare what is included and send a work request when you find the right fit."}
            </p>
          </div>
          {isFreelancer && (
            <button onClick={() => setShowCreateForm((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_0_#115a49] transition hover:-translate-y-0.5 hover:bg-[#146957] active:translate-y-0">
              {showCreateForm ? <X size={17} /> : <Plus size={17} />}
              {showCreateForm ? "Close form" : "Create a service"}
            </button>
          )}
        </section>

        {notice && (
          <div role={notice.type === "error" ? "alert" : "status"} className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${notice.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-[#d9ebdc] bg-[#edf8ef] text-[#276848]"}`}>
            {notice.type === "error" ? <X size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
            <span>{notice.text}</span>
            <button className="ml-auto text-current opacity-70 hover:opacity-100" onClick={() => setNotice(null)} aria-label="Dismiss message"><X size={16} /></button>
          </div>
        )}

        {isFreelancer && showCreateForm && (
          <section className="mb-8 rounded-[26px] border border-[#dfe9df] bg-white p-5 shadow-[0_10px_35px_rgba(28,67,45,0.05)] sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e5f4e9] text-[#197d68]"><BriefcaseBusiness size={20} /></div>
              <div><h2 className="text-xl font-semibold">Create a service listing</h2><p className="mt-1 text-sm text-[#829087]">Be specific about the deliverable, price and turnaround time.</p></div>
            </div>
            <form onSubmit={handleCreateService} className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-[#476052] md:col-span-2">Service title
                <input name="title" value={serviceForm.title} onChange={handleServiceChange} placeholder="e.g. Responsive business website" required maxLength={255} className={`${inputClass} mt-2`} />
              </label>
              <label className="text-sm font-semibold text-[#476052] md:col-span-2">Description
                <textarea name="description" value={serviceForm.description} onChange={handleServiceChange} placeholder="Explain what's included, what the client receives, and any important requirements." required maxLength={1000} rows={4} className={`${inputClass} mt-2 resize-y`} />
                <span className="mt-1 block text-right text-xs font-normal text-[#9aa69e]">{serviceForm.description.length}/1000</span>
              </label>
              <label className="text-sm font-semibold text-[#476052]">Category
                <select name="category" value={serviceForm.category} onChange={handleServiceChange} className={`${inputClass} mt-2`}>
                  {categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-semibold text-[#476052]">Price (₹)
                  <input name="price" type="number" min="1" step="1" value={serviceForm.price} onChange={handleServiceChange} placeholder="5000" required className={`${inputClass} mt-2`} />
                </label>
                <label className="text-sm font-semibold text-[#476052]">Delivery (days)
                  <input name="deliveryDays" type="number" min="1" step="1" value={serviceForm.deliveryDays} onChange={handleServiceChange} placeholder="7" required className={`${inputClass} mt-2`} />
                </label>
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#146957] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Publishing…" : "Publish service"}<ArrowRight size={16} /></button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="rounded-xl border border-[#e0e8e0] px-5 py-3 text-sm font-semibold text-[#607468] transition hover:bg-[#f7faf7]">Cancel</button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-[24px] border border-[#e3ebe3] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a69d]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isFreelancer ? "Search your services…" : "Search services, skills or freelancers…"} aria-label="Search services" className={`${inputClass} pl-11`} />
            </div>
            <div className="relative lg:w-64">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a69d]" />
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category" className={`${inputClass} pl-10`}>
                <option value="ALL">All categories</option>
                {categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf1ed] pt-4 text-xs text-[#859188]">
            <span>{loading ? "Loading listings…" : `${filteredServices.length} ${filteredServices.length === 1 ? "service" : "services"} ${isFreelancer ? "in your listings" : "available to explore"}`}</span>
            {(query || categoryFilter !== "ALL") && <button onClick={() => { setQuery(""); setCategoryFilter("ALL"); }} className="font-semibold text-[#197d68] hover:underline">Clear filters</button>}
          </div>
        </section>

        {loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-72 animate-pulse rounded-3xl border border-[#e5ece5] bg-white" />)}</div>
        ) : filteredServices.length === 0 ? (
          <div className="mt-6 rounded-[26px] border border-dashed border-[#d8e4d9] bg-white px-6 py-14 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eaf5ed] text-[#478368]"><Image size={23} /></div>
            <h2 className="mt-4 text-lg font-semibold text-[#2a4738]">{services.length === 0 ? (isFreelancer ? "Your first service starts here" : "No services available yet") : "No matching services"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#87958b]">{services.length === 0 ? (isFreelancer ? "Create a listing to showcase what you do and make it easier for clients to find you." : "There are no listings to show right now. Check back soon or try another category.") : "Try another keyword or clear the category filter."}</p>
            {isFreelancer && services.length === 0 && <button onClick={() => setShowCreateForm(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white hover:bg-[#146957]"><Plus size={16} /> Create your first service</button>}
            {(query || categoryFilter !== "ALL") && <button onClick={() => { setQuery(""); setCategoryFilter("ALL"); }} className="mt-5 block w-full text-sm font-semibold text-[#197d68] hover:underline">Clear filters</button>}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <article key={service.id} className="group flex flex-col rounded-[25px] border border-[#e2eae2] bg-white p-5 shadow-[0_5px_20px_rgba(25,60,39,0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#cbded0] hover:shadow-[0_18px_35px_rgba(25,60,39,0.08)] sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-[#e9f5ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#397b60]">{categoryLabels[service.category] || service.category?.replaceAll("_", " ") || "Service"}</span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f5f8f4] text-[#73917c] transition group-hover:bg-[#e5f4e9] group-hover:text-[#197d68]"><Code2 size={18} /></span>
                </div>
                <h2 className="mt-5 text-lg font-semibold leading-6 text-[#254536]">{service.title}</h2>
                <p className="mt-3 line-clamp-4 flex-1 whitespace-pre-line text-sm leading-6 text-[#7e8d83]">{service.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf1ed] pt-5">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#98a49b]">Starting at</p><p className="mt-1 text-xl font-bold tracking-tight text-[#1e4735]">{formatPrice(service.price)}</p></div>
                  <div className="text-right"><p className="inline-flex items-center gap-1.5 text-xs text-[#839087]"><Clock3 size={14} /> {service.deliveryDays} days</p><p className="mt-1 max-w-36 truncate text-xs font-medium text-[#60766a]">
  {isFreelancer ? (
    "Your listing"
  ) : (
    <ProfileLink
      record={service}
      role="FREELANCER"
      name={service.freelancerName || "Five2Nine freelancer"}
      className="cursor-pointer hover:underline"
    />
  )}
</p></div>
                </div>
                {!isFreelancer && <button onClick={() => openProposal(service)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#197d68] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#146957] active:translate-y-0">Send work request <ArrowRight size={16} /></button>}
              </article>
            ))}
          </div>
        )}
      </main>

      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271d]/50 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) setSelectedService(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="service-request-title" className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-white/70 bg-[#fbfcfa] p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#398064]">START A CONVERSATION</p><h2 id="service-request-title" className="mt-2 text-2xl font-semibold tracking-tight text-[#213e2f]">Send a work request</h2><p className="mt-1 text-sm text-[#849188]">For: {selectedService.title}</p></div>
              <button type="button" disabled={submitting} onClick={() => setSelectedService(null)} className="rounded-xl border border-[#e4ebe3] bg-white p-2 text-[#75867b] transition hover:bg-[#f0f6f0] disabled:opacity-50" aria-label="Close work request"><X size={19} /></button>
            </div>
            <form onSubmit={handleProposalSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-[#476052]">Your requirements<textarea value={proposalForm.requirements} onChange={(event) => setProposalForm((prev) => ({ ...prev, requirements: event.target.value }))} placeholder="What do you need the freelancer to deliver?" required rows={3} className={`${inputClass} mt-2 resize-y`} /></label>
              <label className="block text-sm font-semibold text-[#476052]">Project details<textarea value={proposalForm.description} onChange={(event) => setProposalForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Share any background, references or expectations." required rows={3} className={`${inputClass} mt-2 resize-y`} /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-[#476052]">Your offered price (₹)<input type="number" min="1" required value={proposalForm.price} onChange={(event) => setProposalForm((prev) => ({ ...prev, price: event.target.value }))} className={`${inputClass} mt-2`} /></label>
                <label className="text-sm font-semibold text-[#476052]">Expected delivery date<input type="date" min={new Date().toISOString().slice(0, 10)} required value={proposalForm.expectedDeliveryDate} onChange={(event) => setProposalForm((prev) => ({ ...prev, expectedDeliveryDate: event.target.value }))} className={`${inputClass} mt-2`} /></label>
              </div>
              <label className="block text-sm font-semibold text-[#476052]">Reference attachment (optional)
                <span className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#cddfcf] bg-white px-4 py-3 text-sm font-normal text-[#77887d] transition hover:bg-[#f6faf6]"><FileUp size={18} className="text-[#448568]" />{proposalForm.attachmentName || "Choose a reference file"}<input type="file" className="sr-only" onChange={handleFileChange} /></span>
                <span className="mt-1 block text-xs font-normal text-[#9aa69e]">The current API stores attachment metadata only, not the file itself.</span>
              </label>
              <label className="block text-sm font-semibold text-[#476052]">Message (optional)<textarea value={proposalForm.comment} onChange={(event) => setProposalForm((prev) => ({ ...prev, comment: event.target.value }))} placeholder="Add a short message" rows={2} className={`${inputClass} mt-2 resize-y`} /></label>
              <div className="flex flex-wrap justify-end gap-3 border-t border-[#e9eee8] pt-5">
                <button type="button" disabled={submitting} onClick={() => setSelectedService(null)} className="rounded-xl border border-[#e0e8e0] px-5 py-3 text-sm font-semibold text-[#607468] hover:bg-white disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-[#197d68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#146957] disabled:opacity-60">{submitting ? "Sending…" : "Send request"}<ArrowRight size={16} /></button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
