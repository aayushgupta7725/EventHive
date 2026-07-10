import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiLock, FiGlobe, FiArrowRight } from 'react-icons/fi';

// Deterministic Unsplash image per category — fixed photo IDs so they never change
const CATEGORY_IMAGES = {
  Music:     'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
  Tech:      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  Sports:    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
  Art:       'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
  Food:      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  Business:  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
  Gaming:    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
  Health:    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  Education: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
  Social:    'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80',
  Other:     'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
};

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
  const emoji       = CATEGORY_EMOJIS[event.category] || '✨';
  const fallbackImg = CATEGORY_IMAGES[event.category] || CATEGORY_IMAGES.Other;
  const imgSrc      = event.cover_image || fallbackImg;
  const [imgError, setImgError] = useState(false);

    return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="group bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-[0_4px_20px_rgba(109,40,217,0.05)] hover:shadow-[0_8px_28px_rgba(109,40,217,0.12)] hover:-translate-y-1 transition-all duration-300">
        {/* Cover image — falls back to category stock photo, then emoji */}
        {!imgError ? (
          <img
            src={imgSrc}
            alt={event.title}
            className="w-full aspect-video object-cover"
            onError={() => setImgError(true)}
          />
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
