import { Link } from 'react-router-dom';
import { getParticipantUserId } from '../utils/profileLinks';

/** A consistent public-profile link for a participant in a marketplace record. */
export default function ProfileLink({ record, role, name, className = '' }) {
  const userId = getParticipantUserId(record, role);
  const label = name?.trim() || (String(role).toUpperCase() === 'CLIENT' ? 'Client' : 'Freelancer');

  if (!userId) {
    // Avoid creating a broken /users/undefined URL when an API response omits the user ID.
    return <span className={className} title="Public profile link unavailable: user ID was not included in this record">{label}</span>;
  }

  return (
    <Link to={`/users/${encodeURIComponent(userId)}`} className={`${className} hover:underline focus-visible:underline`.trim()}>
      {label}
    </Link>
  );
}
