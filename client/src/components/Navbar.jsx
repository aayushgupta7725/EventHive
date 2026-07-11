import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiCompass, FiPlus, FiUser, FiLogOut, FiBell, FiCheck, FiX } from 'react-icons/fi';
import { requestNotificationPermission } from '../services/firebase';

// ── Seed notifications shown on first open ──────────
const SEED_NOTIFICATIONS = [
  { id: 1, title: 'Welcome to EventHive! 🐝', body: 'Discover events, RSVP, and connect with others.', time: 'Just now',  read: false },
  { id: 2, title: 'Tip: Host your first event', body: 'Click "Host Event" in the nav to get started.', time: '1 min ago', read: false },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifOpen,  setNotifOpen]  = useState(false);
  const [notifs,     setNotifs]     = useState(SEED_NOTIFICATIONS);
  const [permAsked,  setPermAsked]  = useState(false);
  const panelRef = useRef(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  // Close panel when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBellClick = async () => {
    setNotifOpen(prev => !prev);
    // Mark all as read when panel opens
    if (!notifOpen) {
      setNotifs(ns => ns.map(n => ({ ...n, read: true })));
    }
    // Ask for push permission once
    if (!permAsked) {
      setPermAsked(true);
      await requestNotificationPermission();
    }
  };

  const dismissNotif = (e, id) => {
    e.stopPropagation();
    setNotifs(ns => ns.filter(n => n.id !== id));
  };

  const clearAll = () => setNotifs([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitial = (name) => name?.[0]?.toUpperCase() || '?';

  return (
  <nav className="fixed top-0 left-0 right-0 h-[72px] z-[1000] bg-white/85 backdrop-blur-md border-b border-outline-variant/30">
    <div className="flex items-center justify-between h-full max-w-[1280px] mx-auto px-6">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl text-on-surface">
        <div className="w-9 h-9 bg-primary-container rounded-xl flex items-center justify-center text-lg">🐝</div>
        <span>Event<span className="text-primary">Hive</span></span>
      </Link>

      {/* Nav Links */}
      {user && (
        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-primary bg-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`
            }
          >
            <FiCompass size={16} /> Discover
          </NavLink>
          <NavLink
            to="/create-event"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-primary bg-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`
            }
          >
            <FiPlus size={16} /> Host Event
          </NavLink>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Bell + Notification Panel */}
            <div className="relative" ref={panelRef}>
              <button
                onClick={handleBellClick}
                className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
                title="Notifications"
              >
                <FiBell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-primary text-white rounded-full border-2 border-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {notifOpen && (
                <div
                  className="fixed top-[72px] left-4 right-4 sm:absolute sm:top-[calc(100%+10px)] sm:-right-2 sm:left-auto sm:w-80 bg-white rounded-2xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 animate-fade overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
                    <span className="text-sm font-bold text-on-surface">Notifications</span>
                    {notifs.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-on-surface-variant hover:text-primary font-medium transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* List */}
                  {notifs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                      <FiBell size={28} className="text-on-surface-variant opacity-30 mb-3" />
                      <p className="text-sm text-on-surface-variant">You're all caught up!</p>
                    </div>
                  ) : (
                    <ul className="max-h-72 overflow-y-auto divide-y divide-outline-variant/10">
                      {notifs.map(n => (
                        <li
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.read ? 'bg-white' : 'bg-primary/5'}`}
                        >
                          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-on-surface leading-tight">{n.title}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">{n.body}</p>
                            <p className="text-[10px] text-on-surface-variant/60 mt-1">{n.time}</p>
                          </div>
                          <button
                            onClick={(e) => dismissNotif(e, n.id)}
                            className="text-on-surface-variant/40 hover:text-on-surface-variant transition-colors shrink-0 mt-0.5"
                          >
                            <FiX size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${isActive ? 'bg-secondary-container' : 'hover:bg-surface-container'}`
              }
            >
              <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-sm font-bold overflow-hidden">
                {user.avatar_url
                  ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  : getInitial(user.name)
                }
              </div>
              <span className="text-sm font-semibold text-on-surface hidden sm:inline">{user.name?.split(' ')[0]}</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-secondary-container text-primary text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-secondary-container/80 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="bg-primary-container text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  </nav>
);
}
