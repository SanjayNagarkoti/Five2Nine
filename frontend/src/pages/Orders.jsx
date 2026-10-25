import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../components/AppNav";
import ProfileLink from "../components/ProfileLink";
import { getMyOrders } from "../service/orderService";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#dfe8e0] bg-white px-4 py-3 text-sm text-[#294638] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#78b79a] focus:ring-4 focus:ring-[#e4f3e9]";

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
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function readableDate(value) {
  if (!value) return "Not specified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function statusStyle(status) {
  const value = String(status || "PENDING").toUpperCase();
  if (["COMPLETED", "DELIVERED", "ACCEPTED"].includes(value)) return "bg-[#e7f5eb] text-[#287d61] ring-[#d4ebda]";
  if (["CANCELLED", "REJECTED", "DISPUTED"].includes(value)) return "bg-rose-50 text-rose-700 ring-rose-200";
  if (["IN_PROGRESS", "ACTIVE", "IN PROGRESS"].includes(value)) return "bg-[#eaf0ff] text-[#5267a5] ring-[#dfe5f8]";
  return "bg-[#fff3df] text-[#9a6b22] ring-[#f2e3c6]";
}

export default function Orders() {
  const user = useMemo(() => readUser(), []);
  const isClient = user?.role?.toUpperCase() === "CLIENT";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : data?.content || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setNotice({ type: "error", text: errorText(error, "Failed to load orders.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const visibleOrders = orders.filter((order) => {
    const searchable = [order.id, order.serviceTitle, order.projectTitle, order.clientName, order.freelancerName, order.status]
      .filter(Boolean).join(" ").toLowerCase();
    return searchable.includes(query.trim().toLowerCase()) &&
      (statusFilter === "ALL" || String(order.status || "PENDING").toUpperCase() === statusFilter);
  });

  const activeCount = orders.filter((order) => ["IN_PROGRESS", "ACTIVE", "IN PROGRESS"].includes(String(order.status).toUpperCase())).length;
  const completedCount = orders.filter((order) => ["COMPLETED", "DELIVERED"].includes(String(order.status).toUpperCase())).length;
  const accent = isClient ? "text-[#5267a5]" : "text-[#197d68]";

  return (
    <div className={`min-h-screen ${isClient ? "bg-[#f6f7fb]" : "bg-[#f5f8f5]"} text-[#1b332d]`}>
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className={`mb-3 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] ${isClient ? "border-[#e0e6f6] text-[#5267a5]" : "border-[#dcebe0] text-[#287d61]"}`}><Sparkles size={13} /> {isClient ? "YOUR HIRING ACTIVITY" : "YOUR WORK IN MOTION"}</div>
            <h1 className="font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">{isClient ? "Orders & projects" : "My orders"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c8b81] sm:text-base">{isClient ? "Keep accepted work organised, review agreed details and stay aligned with the freelancers you hire." : "Keep track of your accepted work, agreed deliverables and delivery dates in one place."}</p>
          </div>
          <button onClick={loadOrders} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#e0e8e0] bg-white px-4 py-3 text-sm font-semibold text-[#536d5e] transition hover:bg-[#f7faf7] disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh orders</button>
        </section>

        {notice && <div role={notice.type === "error" ? "alert" : "status"} className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${notice.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-[#d9ebdc] bg-[#edf8ef] text-[#276848]"}`}><span className="flex-1">{notice.text}</span><button onClick={() => setNotice(null)} aria-label="Dismiss message"><X size={16} /></button></div>}

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e3ebe3] bg-white p-5"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-[#839087]">Total orders</p><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0f4ef] text-[#698773]"><ShoppingBag size={17} /></span></div><p className="mt-3 text-3xl font-semibold tracking-tight text-[#254536]">{loading ? "—" : orders.length}</p><p className="mt-1 text-xs text-[#9aa69e]">Orders in your account</p></div>
          <div className="rounded-2xl border border-[#e3ebe3] bg-white p-5"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-[#839087]">In progress</p><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eaf0ff] text-[#5267a5]"><Clock3 size={17} /></span></div><p className="mt-3 text-3xl font-semibold tracking-tight text-[#254536]">{loading ? "—" : activeCount}</p><p className="mt-1 text-xs text-[#9aa69e]">Based on current order status</p></div>
          <div className="rounded-2xl border border-[#dcebe0] bg-[#edf7ef] p-5"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-[#668272]">Completed</p><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#34815e]"><CheckCircle2 size={17} /></span></div><p className="mt-3 text-3xl font-semibold tracking-tight text-[#254536]">{loading ? "—" : completedCount}</p><p className="mt-1 text-xs text-[#809589]">Completed or delivered</p></div>
        </section>

        <section className="rounded-[24px] border border-[#e3ebe3] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a69d]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isClient ? "Search by freelancer, project or order ID…" : "Search by client, service or order ID…"} aria-label="Search orders" className={`${inputClass} pl-11`} /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter order status" className={`${inputClass} sm:w-56`}><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="IN_PROGRESS">In progress</option><option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option></select></div>
          {(query || statusFilter !== "ALL") && <div className="mt-3 flex justify-end"><button onClick={() => { setQuery(""); setStatusFilter("ALL"); }} className={`text-xs font-semibold hover:underline ${accent}`}>Clear filters</button></div>}
        </section>

        {loading ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">{[1, 2].map((item) => <div key={item} className="h-72 animate-pulse rounded-3xl border border-[#e5ece5] bg-white" />)}</div>
        ) : visibleOrders.length === 0 ? (
          <div className="mt-6 rounded-[26px] border border-dashed border-[#d8e4d9] bg-white px-6 py-14 text-center">
            <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isClient ? "bg-[#edf0fc] text-[#5267a5]" : "bg-[#eaf5ed] text-[#478368]"}`}><PackageCheck size={24} /></div>
            <h2 className="mt-4 text-lg font-semibold text-[#2a4738]">{orders.length === 0 ? (isClient ? "Your hired work will appear here" : "Your next order starts with a proposal") : "No matching orders"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#87958b]">{orders.length === 0 ? (isClient ? "When a proposal is accepted, its order details will be available here." : "When you and a client agree to a proposal, the accepted work will be tracked here.") : "Try another search term or status filter."}</p>
            {orders.length === 0 && <Link to={isClient ? "/services" : "/projects"} className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 ${isClient ? "bg-[#5367a5] hover:bg-[#43568f]" : "bg-[#197d68] hover:bg-[#146957]"}`}>{isClient ? "Explore services" : "Explore projects"}<ArrowUpRight size={16} /></Link>}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {visibleOrders.map((order) => (
              <article key={order.id} className="overflow-hidden rounded-[25px] border border-[#e2eae2] bg-white shadow-[0_5px_20px_rgba(25,60,39,0.025)] transition duration-300 hover:-translate-y-0.5 hover:border-[#cbded0] hover:shadow-[0_16px_32px_rgba(25,60,39,0.06)]">
                <div className={`h-1.5 ${isClient ? "bg-[#6679b8]" : "bg-[#298365]"}`} />
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1"><p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${accent}`}>ORDER #{order.id}</p><h2 className="mt-2 break-words text-xl font-semibold leading-6 text-[#254536]">{order.serviceTitle || order.projectTitle || "Custom work"}</h2><p className="mt-2 text-xs text-[#87958b]">
                        {isClient ? "Freelancer" : "Client"}: <span className="font-semibold text-[#526b5c]">
                          <ProfileLink
                            record={order}
                            role={isClient ? "FREELANCER" : "CLIENT"}
                            name={isClient ? order.freelancerName || "Not specified" : order.clientName || "Not specified"}
                          />
                        </span>
                      </p></div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${statusStyle(order.status)}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{String(order.status || "PENDING").replaceAll("_", " ")}</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#f7f9f6] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#91a096]">{isClient ? "Agreed budget" : "Agreed amount"}</p><p className="mt-2 text-xl font-bold tracking-tight text-[#254536]">{money(order.agreedPrice)}</p></div>
                    <div className="rounded-2xl bg-[#f7f9f6] p-4"><p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#91a096]"><CalendarDays size={12} /> Delivery date</p><p className="mt-2 text-sm font-semibold text-[#4b6455]">{readableDate(order.agreedDeliveryDate)}</p></div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#edf1ed] p-4">
                    <div className="flex items-center gap-2"><FileText size={15} className="text-[#73917c]" /><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#829087]">Agreed scope</p></div>
                    <p className="mt-3 text-xs font-semibold text-[#4d6757]">Requirements</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#718278]">{order.requirements || "No requirements provided."}</p>
                    <p className="mt-3 text-xs font-semibold text-[#4d6757]">Description</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#718278]">{order.description || "No description provided."}</p>
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#f7f9f6] p-3.5"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${isClient ? "bg-[#e8edfb] text-[#5267a5]" : "bg-[#e5f4e9] text-[#197d68]"}`}>{isClient ? <Handshake size={17} /> : <ShieldCheck size={17} />}</span><p className="text-xs leading-5 text-[#7e8d83]">{isClient ? "Keep project expectations and delivery details aligned with your freelancer." : "Use the agreed scope and delivery date to keep your commitment clear with the client."}</p></div>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5ebe4] py-5 text-xs text-[#91a097]"><span>Five2Nine · {isClient ? "Hiring workspace" : "Freelance workspace"}</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} /> Order details from your account</span></footer>
      </main>
    </div>
  );
}
