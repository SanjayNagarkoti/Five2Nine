/**
 * Resolve a participant's USER id from common API response shapes.
 * Extend this function if your backend uses a different DTO property name.
 * Do not pass service/proposal/order/project IDs here.
 */
export function getParticipantUserId(record, role) {
  if (!record) return null;

  const normalizedRole = String(role || '').toUpperCase();
  const candidates = normalizedRole === 'FREELANCER'
    ? [
        record.freelancerId,
        record.freelancerUserId,
        record.freelancer?.userId,
        record.freelancer?.id,
        record.freelancer?.user?.id,
        record.freelancer?.user?.userId,
        record.ownerUserId,
        record.createdByUserId,
        record.userId,
      ]
    : normalizedRole === 'CLIENT'
      ? [
          record.clientId,
          record.clientUserId,
          record.client?.userId,
          record.client?.id,
          record.client?.user?.id,
          record.client?.user?.userId,
          record.ownerUserId,
          record.createdByUserId,
          record.userId,
        ]
      : [record.userId, record.user?.id, record.user?.userId, record.id];

  const id = candidates.find((value) => value !== undefined && value !== null && String(value).trim() !== '');
  return id == null ? null : String(id);
}
