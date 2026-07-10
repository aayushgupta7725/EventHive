import { useState } from 'react';
import { FiCheck, FiX, FiMinus } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function RSVPWidget({ eventId, currentRsvp, onUpdate }) {
  const [status, setStatus]   = useState(currentRsvp);
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (newStatus) => {
    if (loading) return;
    setLoading(true);
    try {
      await api.post(`/events/${eventId}/rsvp`, { status: newStatus });
      setStatus(newStatus);
      onUpdate?.(newStatus);
      toast.success(`RSVP updated: ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update RSVP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        Your RSVP
      </p>
      <div className="rsvp-widget">
        <button
          className={`rsvp-btn ${status === 'going' ? 'active-accept' : ''}`}
          onClick={() => handleRsvp('going')}
          disabled={loading}
        >
          <FiCheck size={15} /> Going
        </button>
        <button
          className={`rsvp-btn ${status === 'maybe' ? 'active-maybe' : ''}`}
          onClick={() => handleRsvp('maybe')}
          disabled={loading}
        >
          <FiMinus size={15} /> Maybe
        </button>
        <button
          className={`rsvp-btn ${status === 'declined' ? 'active-decline' : ''}`}
          onClick={() => handleRsvp('declined')}
          disabled={loading}
        >
          <FiX size={15} /> Decline
        </button>
      </div>
    </div>
  );
}
