import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus, FiFilter, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const FILTERS = ['All', 'Public', 'Private', 'Going', 'Maybe'];
const CATEGORIES = ['All', 'Music', 'Tech', 'Sports', 'Art', 'Food', 'Business', 'Social', 'Gaming', 'Education', 'Health'];

// ── Demo events for UI without backend ──────────────
const DEMO_EVENTS = [
  { id: '1', title: 'Tech Summit 2026', description: 'A gathering of tech enthusiasts, developers, and innovators from around the globe.', location: 'San Francisco, CA', start_date: '2026-08-15T09:00:00Z', end_date: '2026-08-15T18:00:00Z', visibility: 'public', category: 'Tech', rsvp_count: 120 },
  { id: '2', title: 'Jazz Night Under the Stars', description: 'An evening of soulful jazz music with live bands in an open-air setting.', location: 'Central Park, NY', start_date: '2026-08-20T19:00:00Z', end_date: '2026-08-20T23:00:00Z', visibility: 'public', category: 'Music', rsvp_count: 85 },
  { id: '3', title: 'Photography Workshop', description: 'Learn the art of street photography with award-winning photographer Alex Ray.', location: 'Chicago, IL', start_date: '2026-09-05T10:00:00Z', end_date: '2026-09-05T16:00:00Z', visibility: 'private', category: 'Art', rsvp_count: 30 },
  { id: '4', title: 'Startup Pitch Night', description: 'Watch the next big ideas come to life. 10 startups, 10 pitches, 1 winner.', location: 'Austin, TX', start_date: '2026-09-10T18:00:00Z', end_date: '2026-09-10T21:00:00Z', visibility: 'public', category: 'Business', rsvp_count: 200 },
  { id: '5', title: 'Food & Culture Festival', description: 'A celebration of world cuisines, live performances, and cultural exhibitions.', location: 'Los Angeles, CA', start_date: '2026-09-20T11:00:00Z', end_date: '2026-09-20T20:00:00Z', visibility: 'public', category: 'Food', rsvp_count: 450 },
  { id: '6', title: 'Gaming Marathon 24H', description: '24 hours of competitive gaming, tournaments, and community challenges.', location: 'Seattle, WA', start_date: '2026-10-01T00:00:00Z', end_date: '2026-10-02T00:00:00Z', visibility: 'public', category: 'Gaming', rsvp_count: 60 },
];

export default function DashboardPage() {
  const { user }  = useAuth();
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [category, setCategory]   = useState('All');
  const [myRsvps, setMyRsvps]     = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch {
      // Backend not running — use demo data
      setEvents(DEMO_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter((e) => {
    const matchSearch   = e.title.toLowerCase().includes(search.toLowerCase()) ||
                          e.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || e.category === category;
    const matchFilter   = filter === 'All'
      ? true
      : filter === 'Public'   ? e.visibility === 'public'
      : filter === 'Private'  ? e.visibility === 'private'
      : filter === 'Going'    ? myRsvps[e.id] === 'going'
      : filter === 'Maybe'    ? myRsvps[e.id] === 'maybe'
      : true;
    return matchSearch && matchCategory && matchFilter;
  });

    return (
    <div className="pt-[var(--navbar-height)] min-h-screen bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-1">
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-on-surface-variant">Discover and join amazing events</p>
          </div>
          <Link
            to="/create-event"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-primary-container text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            <FiPlus size={18} /> Host an Event
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border-2 border-outline-variant rounded-xl px-4 py-3 mb-6 focus-within:border-primary transition-all">
          <FiSearch size={18} className="text-on-surface-variant shrink-0" />
          <input
            id="event-search"
            className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
            placeholder="Search events by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                category === c
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-secondary-container'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-secondary-container'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="loading-overlay"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-5 opacity-60">🔍</div>
            <h3 className="text-lg font-bold text-on-surface mb-2">No events found</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">
              Try adjusting your search or filters, or be the first to host an event!
            </p>
            <Link
              to="/create-event"
              className="inline-flex items-center gap-2 bg-primary-container text-white text-sm font-semibold px-6 py-3 rounded-xl mt-6"
            >
              <FiPlus /> Create Event
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-on-surface-variant mb-5">
              Showing {filtered.length} event{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((ev) => (
                <EventCard key={ev.id} event={ev} myRsvp={myRsvps[ev.id]} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
