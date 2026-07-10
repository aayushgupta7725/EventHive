import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiLock, FiGlobe, FiArrowRight } from 'react-icons/fi';

const CATEGORY_EMOJIS = {
  Music: '🎵', Tech: '💻', Sports: '⚽', Art: '🎨',
  Food: '🍕', Business: '💼', Gaming: '🎮', Health: '🏥',
  Education: '📚', Social: '🎉', Other: '✨',
};

const RSVP_COLORS = { going: 'badge-green', maybe: 'badge-yellow', declined: 'badge-red' };

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function EventCard({ event, myRsvp }) {
  const emoji = CATEGORY_EMOJIS[event.category] || '✨';

    return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="group bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-[0_4px_20px_rgba(109,40,217,0.05)] hover:shadow-[0_8px_28px_rgba(109,40,217,0.12)] hover:-translate-y-1 transition-all duration-300">
        {/* Image / Placeholder */}
        {event.cover_image ? (
          <img src={event.cover_image} alt={event.title} className="w-full aspect-video object-cover" />
        ) : (
          <div className="w-full aspect-video bg-secondary-container flex items-center justify-center text-5xl">
            {emoji}
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-semibold">
              {event.category || 'Other'}
            </span>
            {event.visibility === 'private' ? (
              <span className="flex items-center gap-1 text-xs text-on-surface-variant"><FiLock size={11} /> Private</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-on-surface-variant"><FiGlobe size={11} /> Public</span>
            )}
          </div>

          <h3 className="text-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="space-y-1.5 mb-5">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <FiCalendar size={15} /> {formatDate(event.start_date)} · {formatTime(event.start_date)}
            </div>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <FiMapPin size={15} /> {event.location || 'Location TBD'}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
            <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
              <FiUsers size={14} /> {event.rsvp_count || 0} attending
            </span>
            {myRsvp ? (
              <span className={`badge ${RSVP_COLORS[myRsvp] || 'badge-purple'}`}>{myRsvp}</span>
            ) : (
              <span className="p-2 rounded-full bg-secondary-container text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <FiArrowRight size={16} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
