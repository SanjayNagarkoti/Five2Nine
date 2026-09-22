import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";

import {
  getMyProposals,
  counterProposal,
  acceptProposal,
  rejectProposal,
  getProposalHistory,
} from "../service/proposalService";

export default function Proposals() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [proposals, setProposals] = useState([]);
  const [history, setHistory] = useState({});
  const [openHistory, setOpenHistory] = useState(null);

  const [counterData, setCounterData] = useState({});

  const loadProposals = async () => {
    try {
      const data = await getMyProposals();
      setProposals(data);
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to load proposals."
      );
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const isMyTurn = (proposal) =>
    proposal.waitingFor === user?.role;

  const handleCounter = async (proposal) => {
    const data =
      counterData[proposal.id] || {};

    const payload = {};

    if (user.role === "CLIENT") {
      if (data.requirements !== undefined) {
        payload.requirements = data.requirements;
      }

      if (data.description !== undefined) {
        payload.description = data.description;
      }
    }

    if (data.price !== undefined && data.price !== "") {
      payload.price = Number(data.price);
    }

    if (
      data.expectedDeliveryDate
    ) {
      payload.expectedDeliveryDate =
        data.expectedDeliveryDate;
    }

    if (data.comment !== undefined) {
      payload.comment = data.comment;
    }

    try {
      await counterProposal(
        proposal.id,
        payload
      );

      alert("Counter proposal sent.");

      setCounterData({
        ...counterData,
        [proposal.id]: {},
      });

      loadProposals();
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to send counter."
      );
    }
  };

  const handleAccept = async (proposalId) => {
    if (!window.confirm("Accept this proposal?")) return;

    try {
      await acceptProposal(proposalId);

      alert(
        "Proposal accepted. Order created successfully."
      );

      loadProposals();
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to accept proposal."
      );
    }
  };

  const handleReject = async (proposalId) => {
    if (!window.confirm("Reject this proposal?")) return;

    try {
      await rejectProposal(proposalId);

      alert("Proposal rejected.");
      loadProposals();
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to reject proposal."
      );
    }
  };

  const showHistory = async (proposalId) => {
    if (openHistory === proposalId) {
      setOpenHistory(null);
      return;
    }

    try {
      const data =
        await getProposalHistory(proposalId);

      setHistory({
        ...history,
        [proposalId]: data,
      });

      setOpenHistory(proposalId);
    } catch (error) {
      alert(
        error.response?.data ||
          "Failed to load history."
      );
    }
  };

  const updateCounter = (
    proposalId,
    field,
    value
  ) => {
    setCounterData({
      ...counterData,
      [proposalId]: {
        ...(counterData[proposalId] || {}),
        [field]: value,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <AppNav />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">
          My Proposals
        </h1>

        <div className="space-y-6 mt-8">
          {proposals.length === 0 && (
            <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
              No proposals yet.
            </div>
          )}

          {proposals.map((proposal) => {
            const data =
              counterData[proposal.id] || {};

            return (
              <div
                key={proposal.id}
                className="bg-white border rounded-2xl p-6"
              >
                <div className="flex justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold text-[#1F8A70]">
                      {proposal.source}
                    </p>

                    <h2 className="text-xl font-bold mt-1">
                      {proposal.serviceTitle ||
                        proposal.projectTitle ||
                        "Custom Work"}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      Client: {proposal.clientName}
                    </p>

                    <p className="text-sm text-gray-500">
                      Freelancer: {proposal.freelancerName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ₹{proposal.price}
                    </p>

                    <p className="text-sm text-gray-500">
                      {proposal.expectedDeliveryDate}
                    </p>

                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-gray-100">
                      {proposal.status}
                    </span>
                  </div>
                </div>

                <div className="border-t mt-5 pt-5">
                  <p className="font-semibold">
                    Requirements
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {proposal.requirements}
                  </p>

                  <p className="font-semibold mt-4">
                    Description
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {proposal.description}
                  </p>

                  {proposal.comment && (
                    <>
                      <p className="font-semibold mt-4">
                        Comment
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {proposal.comment}
                      </p>
                    </>
                  )}
                </div>

                {isMyTurn(proposal) &&
                  proposal.status === "OPEN" && (
                    <div className="border-t mt-5 pt-5">
                      <h3 className="font-semibold">
                        Your Response
                      </h3>

                      {user.role === "CLIENT" && (
                        <>
                          <textarea
                            placeholder="Requirements"
                            value={
                              data.requirements ??
                              proposal.requirements
                            }
                            onChange={(e) =>
                              updateCounter(
                                proposal.id,
                                "requirements",
                                e.target.value
                              )
                            }
                            className="input mt-3 min-h-24"
                          />

                          <textarea
                            placeholder="Description"
                            value={
                              data.description ??
                              proposal.description
                            }
                            onChange={(e) =>
                              updateCounter(
                                proposal.id,
                                "description",
                                e.target.value
                              )
                            }
                            className="input mt-3 min-h-24"
                          />
                        </>
                      )}

                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        <input
                          type="number"
                          min="1"
                          placeholder="Price"
                          value={
                            data.price ??
                            proposal.price
                          }
                          onChange={(e) =>
                            updateCounter(
                              proposal.id,
                              "price",
                              e.target.value
                            )
                          }
                          className="input"
                        />

                        <input
                          type="date"
                          value={
                            data.expectedDeliveryDate ??
                            proposal.expectedDeliveryDate
                          }
                          onChange={(e) =>
                            updateCounter(
                              proposal.id,
                              "expectedDeliveryDate",
                              e.target.value
                            )
                          }
                          className="input"
                        />
                      </div>

                      <textarea
                        placeholder="Comment"
                        value={
                          data.comment ??
                          proposal.comment ??
                          ""
                        }
                        onChange={(e) =>
                          updateCounter(
                            proposal.id,
                            "comment",
                            e.target.value
                          )
                        }
                        className="input mt-3"
                      />

                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                          onClick={() =>
                            handleCounter(proposal)
                          }
                          className="btn"
                        >
                          Send Counter
                        </button>

                        <button
                          onClick={() =>
                            handleAccept(
                              proposal.id
                            )
                          }
                          className="bg-green-600 text-white px-5 py-2.5 rounded-lg"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleReject(
                              proposal.id
                            )
                          }
                          className="bg-red-500 text-white px-5 py-2.5 rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                <button
                  onClick={() =>
                    showHistory(proposal.id)
                  }
                  className="mt-5 text-sm text-[#1F8A70] underline"
                >
                  {openHistory === proposal.id
                    ? "Hide History"
                    : "View Negotiation History"}
                </button>

                {openHistory === proposal.id && (
                  <div className="mt-4 space-y-3">
                    {(history[proposal.id] || []).length ===
                      0 && (
                      <p className="text-sm text-gray-500">
                        No negotiation history yet.
                      </p>
                    )}

                    {(history[proposal.id] || []).map(
                      (event) => (
                        <div
                          key={event.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between">
                            <p className="font-semibold">
                              {event.actorName}
                            </p>

                            <p className="text-xs text-gray-500">
                              {new Date(
                                event.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>

                          <p className="text-xs text-[#1F8A70] mt-1">
                            {event.action}
                          </p>

                          {event.comment && (
                            <p className="text-sm mt-2">
                              {event.comment}
                            </p>
                          )}

                          {event.changes && (
                            <pre className="text-xs mt-3 bg-white border rounded p-3 overflow-auto">
                              {JSON.stringify(
                                JSON.parse(
                                  event.changes
                                ),
                                null,
                                2
                              )}
                            </pre>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}