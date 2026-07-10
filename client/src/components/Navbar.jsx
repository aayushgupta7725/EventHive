import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiCompass, FiPlus, FiUser, FiLogOut, FiBell } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <button className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors" title="Notifications">
              <FiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${isActive ? 'bg-secondary-container' : 'hover:bg-surface-container'}`
              }
            >
              <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-sm font-bold">
                {getInitial(user.name)}
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
