
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../components/AppNav";
import ProfileLink from "../components/ProfileLink";
import {
  getMyProposals,
  counterProposal,
  acceptProposal,
  rejectProposal,
  getProposalHistory,
} from "../service/proposalService";
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Handshake,
  History,
  MessageSquareText,
  RefreshCw,
  Search,
  Sparkles,
  X,
  UserRound,
  CalendarClock,
  IndianRupee,
  FileText,
  MessageCircle,
  GitCompareArrows,
} from "lucide-react";

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

function statusStyle(status) {
  const value = String(status || "OPEN").toUpperCase();

  if (value === "ACCEPTED" || value === "COMPLETED")
    return "bg-[#e7f5eb] text-[#287d61] ring-[#d4ebda]";

  if (value === "REJECTED" || value === "CANCELLED")
    return "bg-rose-50 text-rose-700 ring-rose-200";

  if (value === "OPEN" || value === "PENDING")
    return "bg-[#fff3df] text-[#9a6b22] ring-[#f2e3c6]";

  return "bg-[#f0f3f0] text-[#69796f] ring-[#e4e9e4]";
}

function readableDate(value) {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function readableDateTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function safeChanges(value) {
  if (value == null || value === "") return null;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function humanizeKey(key) {
  const labels = {
    price: "Price",
    expectedDeliveryDate: "Delivery date",
    deliveryDate: "Delivery date",
    deliveryDays: "Delivery time",
    comment: "Message",
    requirements: "Requirements",
    description: "Project description",
    title: "Title",
    status: "Status",
    deadline: "Deadline",
  };

  if (labels[key]) return labels[key];

  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatFieldValue(key, value) {
  if (value == null || value === "") return "Not provided";

  const normalizedKey = String(key).toLowerCase();

  if (
    normalizedKey.includes("price") ||
    normalizedKey.includes("amount") ||
    normalizedKey.includes("budget")
  ) {
    const amount = Number(value);

    if (Number.isFinite(amount)) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(amount);
    }
  }

  if (
    normalizedKey.toLowerCase().includes("date") ||
    normalizedKey.toLowerCase().includes("deadline")
  ) {
    return readableDate(value);
  }

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([childKey, childValue]) =>
        `${humanizeKey(childKey)}: ${String(childValue ?? "Not provided")}`
      )
      .join(" · ");
  }

  return String(value);
}

function getChangeEntries(changes) {
  if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
    return [];
  }

  return Object.entries(changes).map(([key, value]) => {
    const label = humanizeKey(key);

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      ("from" in value || "to" in value)
    ) {
      return {
        key,
        label,
        from: formatFieldValue(key, value.from),
        to: formatFieldValue(key, value.to),
      };
    }

    return {
      key,
      label,
      from: null,
      to: formatFieldValue(key, value),
    };
  });
}

function readableAction(action) {
  const value = String(action || "UPDATE")
    .toUpperCase()
    .replace(/[_-]+/g, " ")
    .trim();

  const labels = {
    CREATED: "Proposal created",
    CREATE: "Proposal created",
    SUBMITTED: "Proposal submitted",
    COUNTERED: "Counter-offer sent",
    COUNTER: "Counter-offer sent",
    ACCEPTED: "Proposal accepted",
    REJECTED: "Proposal rejected",
    UPDATED: "Proposal updated",
    UPDATE: "Negotiation updated",
    CANCELLED: "Proposal cancelled",
    COMPLETED: "Work completed",
  };

  return labels[value] || value.charAt(0) + value.slice(1).toLowerCase();
}

function changeIcon(key) {
  const value = String(key).toLowerCase();

  if (value.includes("price") || value.includes("amount") || value.includes("budget"))
    return IndianRupee;

  if (value.includes("date") || value.includes("deadline") || value.includes("delivery"))
    return CalendarClock;

  if (value.includes("comment") || value.includes("message"))
    return MessageCircle;

  if (value.includes("description") || value.includes("requirement"))
    return FileText;

  return GitCompareArrows;
}

function HistoryChange({ change }) {
  const Icon = changeIcon(change.key);

  return (
    <div className="rounded-xl border border-[#e6ece5] bg-white p-3 sm:p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#62796a]">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#edf6ef] text-[#367b5d]">
          <Icon size={14} />
        </span>
        {change.label}
      </div>

      {change.from !== null ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1 rounded-lg bg-[#f8f8f6] px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#99a49c]">
              Previous
            </p>
            <p className="mt-1 break-words text-sm text-[#758278]">
              {change.from}
            </p>
          </div>

          <ArrowRight
            size={16}
            className="hidden shrink-0 text-[#8b9a8e] sm:block"
          />

          <div className="min-w-0 flex-1 rounded-lg bg-[#edf8ef] px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#43836a]">
              Updated
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-[#2e654b]">
              {change.to}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-[#4f6a59]">
          {change.to}
        </p>
      )}
    </div>
  );
}

function NegotiationEvent({ event }) {
  const changes = getChangeEntries(safeChanges(event.changes));
  const action = readableAction(event.action);

  return (
    <article className="relative rounded-2xl border border-[#e3ebe3] bg-[#fafcf9] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eaf5ed] text-[#367b5d]">
            <UserRound size={18} />
          </span>

          <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-[#294b39]">
              {event.actorName || "Participant"}
            </p>

            <span className="mt-1 inline-flex rounded-full bg-[#eaf5ed] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#397b60]">
              {action}
            </span>
          </div>
        </div>

        <p className="inline-flex items-center gap-1.5 text-xs text-[#8a978e]">
          <Clock3 size={13} />
          {readableDateTime(event.createdAt)}
        </p>
      </div>

      {event.comment && (
        <div className="mt-4 rounded-xl border-l-4 border-[#82b899] bg-white px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#84958a]">
            Message
          </p>
          <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-[#526b5b]">
            {event.comment}
          </p>
        </div>
      )}

      {changes.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#829087]">
            What changed
          </p>
          <div className="grid gap-3">
            {changes.map((change) => (
              <HistoryChange key={change.key} change={change} />
            ))}
          </div>
        </div>
      )}

      {changes.length === 0 &&
        !event.comment &&
        typeof safeChanges(event.changes) === "string" && (
          <p className="mt-4 whitespace-pre-line break-words rounded-xl bg-white p-3 text-sm leading-6 text-[#617468]">
            {safeChanges(event.changes)}
          </p>
        )}
    </article>
  );
}

export default function Proposals() {
  const user = useMemo(() => readUser(), []);
  const role = user?.role?.toUpperCase();
  const isClient = role === "CLIENT";

  const [proposals, setProposals] = useState([]);
  const [history, setHistory] = useState({});
  const [openHistory, setOpenHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState({});
  const [counterData, setCounterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadProposals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyProposals();
      setProposals(Array.isArray(data) ? data : data?.content || []);
    } catch (error) {
      console.error("Failed to load proposals:", error);
      setNotice({
        type: "error",
        text: errorText(error, "Failed to load proposals."),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  const filteredProposals = proposals.filter((proposal) => {
    const searchable = [
      proposal.serviceTitle,
      proposal.projectTitle,
      proposal.clientName,
      proposal.freelancerName,
      proposal.source,
      proposal.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      searchable.includes(query.trim().toLowerCase()) &&
      (statusFilter === "ALL" ||
        String(proposal.status).toUpperCase() === statusFilter)
    );
  });

  const updateCounter = (proposalId, field, value) => {
    setCounterData((previous) => ({
      ...previous,
      [proposalId]: {
        ...(previous[proposalId] || {}),
        [field]: value,
      },
    }));
  };

  const isMyTurn = (proposal) =>
    String(proposal.waitingFor || "").toUpperCase() === role;

  const handleCounter = async (proposal) => {
    const data = counterData[proposal.id] || {};
    const payload = {};

    if (isClient) {
      if (data.requirements !== undefined)
        payload.requirements = data.requirements;
      if (data.description !== undefined)
        payload.description = data.description;
    }

    if (data.price !== undefined && data.price !== "")
      payload.price = Number(data.price);

    if (data.expectedDeliveryDate)
      payload.expectedDeliveryDate = data.expectedDeliveryDate;

    if (data.comment !== undefined)
      payload.comment = data.comment;

    if (Object.keys(payload).length === 0) {
      setNotice({
        type: "error",
        text: "Make at least one change before sending a counter proposal.",
      });
      return;
    }

    setBusyId(proposal.id);
    setNotice(null);

    try {
      await counterProposal(proposal.id, payload);
      setCounterData((previous) => ({
        ...previous,
        [proposal.id]: {},
      }));
      setNotice({
        type: "success",
        text: "Your counter proposal has been sent.",
      });

      setHistory((previous) => {
        const next = { ...previous };
        delete next[proposal.id];
        return next;
      });

      await loadProposals();
    } catch (error) {
      setNotice({
        type: "error",
        text: errorText(error, "Failed to send counter proposal."),
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleAccept = async (proposalId) => {
    if (!window.confirm("Accept this proposal? An order will be created."))
      return;

    setBusyId(proposalId);
    setNotice(null);

    try {
      await acceptProposal(proposalId);
      setNotice({
        type: "success",
        text: "Proposal accepted. The order was created successfully.",
      });
      await loadProposals();
    } catch (error) {
      setNotice({
        type: "error",
        text: errorText(error, "Failed to accept proposal."),
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (proposalId) => {
    if (!window.confirm("Reject this proposal?")) return;

    setBusyId(proposalId);
    setNotice(null);

    try {
      await rejectProposal(proposalId);
      setNotice({
        type: "success",
        text: "Proposal rejected.",
      });
      await loadProposals();
    } catch (error) {
      setNotice({
        type: "error",
        text: errorText(error, "Failed to reject proposal."),
      });
    } finally {
      setBusyId(null);
    }
  };

  const showHistory = async (proposalId) => {
    if (openHistory === proposalId) {
      setOpenHistory(null);
      return;
    }

    setOpenHistory(proposalId);

    if (history[proposalId]) return;

    setHistoryLoading((previous) => ({
      ...previous,
      [proposalId]: true,
    }));

    try {
      const data = await getProposalHistory(proposalId);
      const events = Array.isArray(data) ? data : data?.content || [];

      setHistory((previous) => ({
        ...previous,
        [proposalId]: events,
      }));
    } catch (error) {
      setNotice({
        type: "error",
        text: errorText(error, "Failed to load negotiation history."),
      });
    } finally {
      setHistoryLoading((previous) => ({
        ...previous,
        [proposalId]: false,
      }));
    }
  };

  const openCount = proposals.filter(
    (proposal) => String(proposal.status).toUpperCase() === "OPEN"
  ).length;

  const awaitingMeCount = proposals.filter(
    (proposal) =>
      String(proposal.status).toUpperCase() === "OPEN" &&
      isMyTurn(proposal)
  ).length;

  return (
    <div
      className={`min-h-screen ${
        isClient ? "bg-[#f6f7fb]" : "bg-[#f5f8f5]"
      } text-[#1b332d]`}
    >
      <AppNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div
              className={`mb-3 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] ${
                isClient
                  ? "border-[#e0e6f6] text-[#5267a5]"
                  : "border-[#dcebe0] text-[#287d61]"
              }`}
            >
              <Sparkles size={13} />
              {isClient ? "HIRING CONVERSATIONS" : "CLIENT CONVERSATIONS"}
            </div>

            <h1 className="font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
              {isClient ? "Proposals from freelancers" : "My proposals"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c8b81] sm:text-base">
              {isClient
                ? "Compare offers, negotiate terms and choose the right partner for your project."
                : "Track your offers, respond to counter proposals and keep negotiations moving."}
            </p>
          </div>

          <button
            onClick={loadProposals}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e0e8e0] bg-white px-4 py-3 text-sm font-semibold text-[#536d5e] transition hover:bg-[#f7faf7] disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </section>

        {notice && (
          <div
            role={notice.type === "error" ? "alert" : "status"}
            className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
              notice.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-[#d9ebdc] bg-[#edf8ef] text-[#276848]"
            }`}
          >
            <span className="flex-1">{notice.text}</span>
            <button
              onClick={() => setNotice(null)}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e3ebe3] bg-white p-5">
            <p className="text-xs font-semibold text-[#839087]">
              All proposals
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#254536]">
              {loading ? "—" : proposals.length}
            </p>
            <p className="mt-1 text-xs text-[#9aa69e]">
              In your workspace
            </p>
          </div>

          <div className="rounded-2xl border border-[#e3ebe3] bg-white p-5">
            <p className="text-xs font-semibold text-[#839087]">
              Open proposals
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#254536]">
              {loading ? "—" : openCount}
            </p>
            <p className="mt-1 text-xs text-[#9aa69e]">
              Still in discussion
            </p>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              isClient
                ? "border-[#e0e6f6] bg-[#f2f4fd]"
                : "border-[#dcebe0] bg-[#edf7ef]"
            }`}
          >
            <p className="text-xs font-semibold text-[#839087]">
              Awaiting your response
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#254536]">
              {loading ? "—" : awaitingMeCount}
            </p>
            <p className="mt-1 text-xs text-[#9aa69e]">
              Needs your attention
            </p>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#e3ebe3] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a69d]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  isClient
                    ? "Search by freelancer or project…"
                    : "Search by client or service…"
                }
                aria-label="Search proposals"
                className={`${inputClass} pl-11`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter proposal status"
              className={`${inputClass} sm:w-52`}
            >
              <option value="ALL">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {(query || statusFilter !== "ALL") && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  setQuery("");
                  setStatusFilter("ALL");
                }}
                className={`text-xs font-semibold hover:underline ${
                  isClient ? "text-[#5267a5]" : "text-[#197d68]"
                }`}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {loading ? (
          <div className="mt-6 space-y-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl border border-[#e5ece5] bg-white"
              />
            ))}
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="mt-6 rounded-[26px] border border-dashed border-[#d8e4d9] bg-white px-6 py-14 text-center">
            <div
              className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${
                isClient
                  ? "bg-[#edf0fc] text-[#5267a5]"
                  : "bg-[#eaf5ed] text-[#478368]"
              }`}
            >
              <Handshake size={24} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#2a4738]">
              {proposals.length === 0
                ? isClient
                  ? "No freelancer proposals yet"
                  : "No proposals to show yet"
                : "No matching proposals"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#87958b]">
              {proposals.length === 0
                ? isClient
                  ? "When freelancers respond to your projects or work requests, their offers will appear here."
                  : "When you send a proposal or a client contacts you through a service, you'll be able to track the conversation here."
                : "Try another search or status filter."}
            </p>

            {proposals.length === 0 && (
              <Link
                to="/projects"
                className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white ${
                  isClient
                    ? "bg-[#5367a5] hover:bg-[#43568f]"
                    : "bg-[#197d68] hover:bg-[#146957]"
                }`}
              >
                {isClient ? "Review my projects" : "Explore projects"}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {filteredProposals.map((proposal) => {
              const data = counterData[proposal.id] || {};
              const myTurn =
                isMyTurn(proposal) &&
                String(proposal.status).toUpperCase() === "OPEN";
              const events = history[proposal.id] || [];

              return (
                <article
                  key={proposal.id}
                  className="overflow-hidden rounded-[26px] border border-[#e2eae2] bg-white shadow-[0_5px_20px_rgba(25,60,39,0.025)] transition hover:border-[#cbded0] hover:shadow-[0_16px_32px_rgba(25,60,39,0.06)]"
                >
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                              isClient
                                ? "bg-[#edf0fc] text-[#5267a5]"
                                : "bg-[#e9f5ed] text-[#397b60]"
                            }`}
                          >
                            {proposal.source || "Proposal"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${statusStyle(
                              proposal.status
                            )}`}
                          >
                            {proposal.status || "OPEN"}
                          </span>
                        </div>

                        <h2 className="mt-4 break-words text-xl font-semibold tracking-tight text-[#254536] sm:text-2xl">
                          {proposal.serviceTitle ||
                            proposal.projectTitle ||
                            "Custom work"}
                        </h2>

                        <p className="mt-2 text-sm text-[#78887e]">
                          {isClient ? "Freelancer" : "Client"}:{" "}
                          <span className="font-semibold text-[#4b6455]">
                            <ProfileLink
                              record={proposal}
                              role={isClient ? "FREELANCER" : "CLIENT"}
                              name={
                                isClient
                                  ? proposal.freelancerName || "Not specified"
                                  : proposal.clientName || "Not specified"
                              }
                            />
                          </span>
                        </p>
                      </div>

                      <div className="min-w-32 rounded-2xl bg-[#f7f9f6] px-4 py-3 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#97a39a]">
                          Proposed amount
                        </p>
                        <p className="mt-1 text-2xl font-bold tracking-tight text-[#254536]">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(Number(proposal.price) || 0)}
                        </p>
                        <p className="mt-1 inline-flex items-center justify-end gap-1 text-xs text-[#849188]">
                          <CalendarDays size={13} />
                          {readableDate(proposal.expectedDeliveryDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-[#edf1ed] pt-5 md:grid-cols-2">
                      <div className="rounded-2xl bg-[#f8faf7] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#829087]">
                          Requirements
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#596f61]">
                          {proposal.requirements || "No requirements provided."}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f8faf7] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#829087]">
                          Project details
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#596f61]">
                          {proposal.description || "No description provided."}
                        </p>
                        {proposal.comment && (
                          <p className="mt-3 border-t border-[#e8eee7] pt-3 text-sm leading-6 text-[#718278]">
                            “{proposal.comment}”
                          </p>
                        )}
                      </div>
                    </div>

                    {myTurn ? (
                      <section
                        className={`mt-6 rounded-2xl border p-4 sm:p-5 ${
                          isClient
                            ? "border-[#e1e6f7] bg-[#f8f9fe]"
                            : "border-[#dcebe0] bg-[#f6fbf6]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                              isClient
                                ? "bg-[#e9edfb] text-[#5267a5]"
                                : "bg-[#e4f3e9] text-[#197d68]"
                            }`}
                          >
                            <MessageSquareText size={18} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#2c4939]">
                              Your response
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-[#829087]">
                              Review the offer, propose changes, or accept/reject it.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          {isClient && (
                            <>
                              <label className="text-xs font-semibold text-[#62776a] md:col-span-2">
                                Updated requirements
                                <textarea
                                  value={
                                    data.requirements ??
                                    proposal.requirements ??
                                    ""
                                  }
                                  onChange={(event) =>
                                    updateCounter(
                                      proposal.id,
                                      "requirements",
                                      event.target.value
                                    )
                                  }
                                  rows={3}
                                  className={`${inputClass} mt-2 resize-y`}
                                />
                              </label>

                              <label className="text-xs font-semibold text-[#62776a] md:col-span-2">
                                Updated description
                                <textarea
                                  value={
                                    data.description ??
                                    proposal.description ??
                                    ""
                                  }
                                  onChange={(event) =>
                                    updateCounter(
                                      proposal.id,
                                      "description",
                                      event.target.value
                                    )
                                  }
                                  rows={3}
                                  className={`${inputClass} mt-2 resize-y`}
                                />
                              </label>
                            </>
                          )}

                          <label className="text-xs font-semibold text-[#62776a]">
                            Counter price (₹)
                            <input
                              type="number"
                              min="1"
                              value={data.price ?? proposal.price ?? ""}
                              onChange={(event) =>
                                updateCounter(
                                  proposal.id,
                                  "price",
                                  event.target.value
                                )
                              }
                              className={`${inputClass} mt-2`}
                            />
                          </label>

                          <label className="text-xs font-semibold text-[#62776a]">
                            Delivery date
                            <input
                              type="date"
                              value={
                                data.expectedDeliveryDate ??
                                (proposal.expectedDeliveryDate
                                  ? String(
                                      proposal.expectedDeliveryDate
                                    ).slice(0, 10)
                                  : "")
                              }
                              onChange={(event) =>
                                updateCounter(
                                  proposal.id,
                                  "expectedDeliveryDate",
                                  event.target.value
                                )
                              }
                              className={`${inputClass} mt-2`}
                            />
                          </label>

                          <label className="text-xs font-semibold text-[#62776a] md:col-span-2">
                            Message / counter note
                            <textarea
                              value={data.comment ?? ""}
                              onChange={(event) =>
                                updateCounter(
                                  proposal.id,
                                  "comment",
                                  event.target.value
                                )
                              }
                              rows={2}
                              placeholder="Explain the changes or add a message"
                              className={`${inputClass} mt-2 resize-y`}
                            />
                          </label>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3 border-t border-[#e4ece3] pt-4">
                          <button
                            disabled={busyId === proposal.id}
                            onClick={() => handleCounter(proposal)}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
                              isClient
                                ? "bg-[#5367a5] hover:bg-[#43568f]"
                                : "bg-[#197d68] hover:bg-[#146957]"
                            }`}
                          >
                            <ArrowDownRight size={16} />
                            {busyId === proposal.id ? "Working…" : "Send counter"}
                          </button>

                          <button
                            disabled={busyId === proposal.id}
                            onClick={() => handleAccept(proposal.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#e7f5eb] px-4 py-2.5 text-sm font-semibold text-[#28734f] transition hover:bg-[#d8efdf] disabled:opacity-50"
                          >
                            <Check size={16} />
                            Accept proposal
                          </button>

                          <button
                            disabled={busyId === proposal.id}
                            onClick={() => handleReject(proposal.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      </section>
                    ) : String(proposal.status).toUpperCase() === "OPEN" ? (
                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#f8f8f3] px-4 py-3 text-xs text-[#849087]">
                        <Clock3 size={15} />
                        Waiting for{" "}
                        {proposal.waitingFor === "CLIENT"
                          ? "the client"
                          : proposal.waitingFor === "FREELANCER"
                          ? "the freelancer"
                          : "the other party"}{" "}
                        to respond.
                      </div>
                    ) : null}

                    <div className="mt-5 border-t border-[#edf1ed] pt-4">
                      <button
                        onClick={() => showHistory(proposal.id)}
                        className={`inline-flex items-center gap-2 text-sm font-semibold transition hover:underline ${
                          isClient ? "text-[#5267a5]" : "text-[#197d68]"
                        }`}
                      >
                        <History size={16} />
                        {openHistory === proposal.id
                          ? "Hide negotiation history"
                          : "View negotiation history"}
                        <ArrowRight size={14} />
                      </button>

                      {openHistory === proposal.id && (
                        <section className="mt-4 rounded-2xl border border-[#e4ebe3] bg-[#f7faf6] p-4 sm:p-5">
                          <div className="mb-4 flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#397b60] shadow-sm">
                              <History size={18} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#2e4b39]">
                                Negotiation timeline
                              </h3>
                              <p className="mt-1 text-xs leading-5 text-[#829087]">
                                Follow every offer, counter-offer and change made during this conversation.
                              </p>
                            </div>
                          </div>

                          {historyLoading[proposal.id] ? (
                            <div className="space-y-3">
                              <div className="h-24 animate-pulse rounded-xl bg-white" />
                              <div className="h-32 animate-pulse rounded-xl bg-white" />
                            </div>
                          ) : events.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[#d8e4d9] bg-white p-5 text-center">
                              <History
                                size={22}
                                className="mx-auto text-[#93a297]"
                              />
                              <p className="mt-2 text-sm font-semibold text-[#526b5b]">
                                No negotiation history yet
                              </p>
                              <p className="mt-1 text-xs text-[#87958b]">
                                Changes and messages will appear here when the conversation progresses.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {events.map((event, index) => (
                                <div
                                  key={event.id ?? `${proposal.id}-${index}`}
                                  className="relative"
                                >
                                  <NegotiationEvent event={event} />
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
