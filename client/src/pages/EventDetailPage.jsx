import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiCalendar, FiMapPin, FiUsers, FiArrowLeft, FiEdit2, FiTrash2,
  FiLock, FiGlobe, FiCalendar as FiCal, FiShare2
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import RSVPWidget from '../components/RSVPWidget';
import ChatPanel from '../components/ChatPanel';
import GalleryGrid from '../components/GalleryGrid';
import MapEmbed from '../components/MapEmbed';
import api from '../services/api';
import toast from 'react-hot-toast';

// Demo event for UI without backend
const DEMO = {
  id: '1', title: 'Tech Summit 2026',
  description: 'A gathering of tech enthusiasts, developers, and innovators from around the globe. This year\'s summit features keynotes from industry leaders, hands-on workshops, and networking sessions.\n\nTopics include: AI/ML, Web3, Cloud Architecture, DevOps, and more.',
  location: 'Moscone Center, San Francisco, CA', latitude: 37.7845, longitude: -122.4018,
  start_date: '2026-08-15T09:00:00Z', end_date: '2026-08-15T18:00:00Z',
  visibility: 'public', category: 'Tech', rsvp_count: 120,
  host_id: 'demo-host', host_name: 'Aayush Kumar',
};

const DEMO_GUESTS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'going' },
  { id: '2', name: 'Bob Smith',     email: 'bob@example.com',   status: 'going' },
  { id: '3', name: 'Carol White',   email: 'carol@example.com', status: 'maybe' },
];

function formatDateTime(str) {
  if (!str) return '—';
  return new Date(str).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function EventDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const [event, setEvent]   = useState(null);
  const [guests, setGuests] = useState([]);
  const [images, setImages] = useState([]);
  const [rsvp,   setRsvp]   = useState(null);
  const [tab, setTab]       = useState('details');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
    fetchGuests();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.event);
      setRsvp(res.data.myRsvp);
      setImages(res.data.images || []);
    } catch {
      setEvent({ ...DEMO, id });
      setGuests(DEMO_GUESTS);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuests = async () => {
    try {
      const res = await api.get(`/events/${id}/guests`);
      setGuests(res.data);
    } catch {
      setGuests(DEMO_GUESTS);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const handleAddCalendar = () => {
    if (!event) return;
    const start = new Date(event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end   = new Date(event.end_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const url   = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;
    window.open(url, '_blank');
  };

  const isHost = event && user && event.host_id === user.id;

  if (loading) return <div className="page-content loading-overlay"><div className="spinner" style={{ width: 48, height: 48 }} /></div>;
  if (!event)  return <div className="page-content"><div className="container"><p>Event not found</p></div></div>;

  const RSVP_BADGE = { going: 'badge-green', maybe: 'badge-yellow', declined: 'badge-red' };
  const goingCount   = guests.filter(g => g.status === 'going').length;
  const maybeCount   = guests.filter(g => g.status === 'maybe').length;

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: 28 }}>
          <FiArrowLeft /> Back to Events
        </button>

        {/* Cover */}
          <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden bg-secondary-container flex items-center justify-center text-7xl mb-8">
            {event.cover_image
              ? <img
                  src={event.cover_image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              : null
            }
            <span style={{ display: event.cover_image ? 'none' : 'flex' }}>🎉</span>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Left Column */}
            <div>
              {/* Title & Badges */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.visibility === 'private' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'}`}>
                    {event.visibility === 'private' ? <span className="inline-flex items-center gap-1"><FiLock size={11} /> Private</span> : <span className="inline-flex items-center gap-1"><FiGlobe size={11} /> Public</span>}
                  </span>
                  {event.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-highest text-on-surface-variant">
                      {event.category}
                    </span>
                  )}
                  {rsvp && (
                    <span className={`badge ${RSVP_BADGE[rsvp] || 'badge-purple'}`}>You: {rsvp}</span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-3 leading-tight">{event.title}</h1>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-sm font-bold">
                    {event.host_name?.[0] || '?'}
                  </div>
                  <span className="text-sm text-on-surface-variant">
                    Hosted by <strong className="text-on-surface">{event.host_name || 'Event Host'}</strong>
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto gap-1 border-b border-outline-variant/30 mb-7">
                {[['details', 'Details'], ['guests', `Guests (${guests.length})`], ['chat', 'Chat'], ['gallery', 'Gallery']].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                      tab === k ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

            {/* Tab Content */}
                {tab === 'details' && (
                  <div className="animate-fade">
                    <h3 className="text-lg font-bold text-on-surface mb-3">About this Event</h3>
                    <p className="text-on-surface-variant leading-relaxed whitespace-pre-line mb-7">
                      {event.description || 'No description provided.'}
                    </p>
                    <div className="border-t border-outline-variant/30 pt-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <FiCalendar className="text-primary mt-0.5" size={18} />
                        <div>
                          <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Start</div>
                          <div className="text-sm font-medium text-on-surface">{formatDateTime(event.start_date)}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiCalendar className="text-primary mt-0.5" size={18} />
                        <div>
                          <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">End</div>
                          <div className="text-sm font-medium text-on-surface">{formatDateTime(event.end_date)}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-primary mt-0.5" size={18} />
                        <div>
                          <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Location</div>
                          <div className="text-sm font-medium text-on-surface">{event.location || 'TBD'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'guests' && (
                  <div className="animate-fade">
                    <div className="flex gap-3 mb-6 flex-wrap">
                      <div className="flex-1 min-w-[100px] bg-white rounded-2xl border border-outline-variant/30 p-4 text-center">
                        <div className="text-2xl font-extrabold text-accent-green">{goingCount}</div>
                        <div className="text-xs text-on-surface-variant">Going</div>
                      </div>
                      <div className="flex-1 min-w-[100px] bg-white rounded-2xl border border-outline-variant/30 p-4 text-center">
                        <div className="text-2xl font-extrabold text-accent-yellow">{maybeCount}</div>
                        <div className="text-xs text-on-surface-variant">Maybe</div>
                      </div>
                      <div className="flex-1 min-w-[100px] bg-white rounded-2xl border border-outline-variant/30 p-4 text-center">
                        <div className="text-2xl font-extrabold text-primary">{guests.length}</div>
                        <div className="text-xs text-on-surface-variant">Total RSVPs</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {guests.map((g) => (
                        <div key={g.id} className="flex items-center justify-between bg-white rounded-xl border border-outline-variant/30 p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center text-sm font-bold">
                              {g.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-on-surface">{g.name}</div>
                              <div className="text-xs text-on-surface-variant">{g.email}</div>
                            </div>
                          </div>
                          <span className={`badge ${RSVP_BADGE[g.status] || 'badge-purple'}`}>{g.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'chat' && (
                  <div className="animate-fade">
                    <ChatPanel eventId={id} />
                  </div>
                )}

                {tab === 'gallery' && (
                  <div className="animate-fade">
                    <GalleryGrid eventId={id} images={images} onUpdate={setImages} isHost={isHost} />
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="flex flex-col gap-5">
                {/* RSVP Card */}
                <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 shadow-[0_4px_20px_rgba(109,40,217,0.05)]">
                  <RSVPWidget eventId={id} currentRsvp={rsvp} onUpdate={setRsvp} />
                </div>

                {/* Map */}
                <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
                  <MapEmbed location={event.location} />
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl border border-outline-variant/30 p-6">
                  <h4 className="text-sm font-bold text-on-surface mb-4">Event Actions</h4>
                  <div className="flex flex-col gap-2.5">
                    <button
                      className="flex items-center gap-2 w-full bg-surface-container-highest text-on-surface text-sm font-semibold px-4 py-3 rounded-lg hover:bg-secondary-container transition-colors"
                      onClick={handleAddCalendar}
                    >
                      <FiCal size={16} /> Add to Google Calendar
                    </button>
                    <button
                      className="flex items-center gap-2 w-full bg-surface-container-highest text-on-surface text-sm font-semibold px-4 py-3 rounded-lg hover:bg-secondary-container transition-colors"
                      onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                    >
                      <FiShare2 size={16} /> Share Event
                    </button>
                    {isHost && (
                      <>
                        <Link
                          to={`/events/${id}/edit`}
                          className="flex items-center gap-2 w-full bg-surface-container-highest text-on-surface text-sm font-semibold px-4 py-3 rounded-lg hover:bg-secondary-container transition-colors"
                        >
                          <FiEdit2 size={16} /> Edit Event
                        </Link>
                        <button
                          className="flex items-center gap-2 w-full bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 rounded-lg hover:bg-red-100 transition-colors"
                          onClick={handleDelete}
                        >
                          <FiTrash2 size={16} /> Delete Event
                        </button>
                      </>
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
