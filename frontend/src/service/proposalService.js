import axios from "./axiosInstance";

export const createServiceProposal = async (serviceId, data) => {
  const response = await axios.post(
    `/proposals/service/${serviceId}`,
    data
  );

  return response.data;
};

export const createProjectProposal = async (projectId, data) => {
  const response = await axios.post(
    `/proposals/project/${projectId}`,
    data
  );

  return response.data;
};

export const getMyProposals = async () => {
  const response = await axios.get("/proposals/my");
  return response.data;
};

export const counterProposal = async (proposalId, data) => {
  const response = await axios.patch(
    `/proposals/${proposalId}/counter`,
    data
  );

  return response.data;
};

export const acceptProposal = async (proposalId) => {
  const response = await axios.post(
    `/proposals/${proposalId}/accept`
  );

  return response.data;
};

export const rejectProposal = async (proposalId) => {
  const response = await axios.post(
    `/proposals/${proposalId}/reject`
  );

  return response.data;
};

export const getProposalHistory = async (proposalId) => {
  const response = await axios.get(
    `/proposals/${proposalId}/history`
  );

  return response.data;
};