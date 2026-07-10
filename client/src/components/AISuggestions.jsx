import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi2';
import { FiRefreshCw, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CATEGORY_IMAGES = {
  Music:     'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=75',
  Tech:      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=75',
  Sports:    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=75',
  Art:       'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=75',
  Food:      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=75',
  Business:  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=75',
  Gaming:    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=75',
  Health:    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=75',
  Education: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=75',
  Social:    'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&q=75',
  Other:     'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=75',
};

// Skeleton card shown while loading
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30 animate-pulse">
      <div className="h-36 bg-surface-container-highest" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-surface-container-highest rounded w-1/3" />
        <div className="h-3 bg-surface-container-highest rounded w-full" />
        <div className="h-3 bg-surface-container-highest rounded w-4/5" />
      </div>
    </div>
  );
}

export default function AISuggestions() {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);   // { greeting, suggestions, tip }
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/ai/suggestions');
      setData(res.data);
      setFetched(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not load suggestions. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch once when the logged-in user scrolls the component into view
  useEffect(() => {
    if (user && !fetched) {
      fetchSuggestions();
    }
  }, [user, fetched, fetchSuggestions]);

  // Not logged in — show a teaser prompt
  if (!user) {
    return (
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <HiSparkles size={16} /> AI-Powered Suggestions
          </div>
          <h2 className="text-3xl font-bold text-on-surface mb-4">
            Get event picks <span className="text-primary">made for you</span>
          </h2>
          <p className="text-on-surface-variant max-w-md mx-auto mb-8">
            Sign in and add a bio to your profile. Our AI reads your interests and recommends the perfect events.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-primary-container text-white text-sm font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            Get Started Free <FiArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <HiSparkles size={14} /> AI-Powered · Based on your profile
            </div>
            <h2 className="text-3xl font-bold text-on-surface">
              {data?.greeting
                ? <span>{data.greeting}</span>
                : loading
                  ? <span className="text-on-surface-variant">Finding your perfect events…</span>
                  : 'Your personalised picks'
              }
            </h2>
            {data?.tip && (
              <p className="text-sm text-on-surface-variant mt-2 max-w-lg italic">💡 {data.tip}</p>
            )}
          </div>

          <button
            onClick={fetchSuggestions}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Thinking…' : 'Refresh'}
          </button>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-8 text-sm">
            <FiAlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
            {error.includes('bio') && (
              <Link to="/profile" className="ml-auto font-semibold underline underline-offset-2 shrink-0">
                Add bio →
              </Link>
            )}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {loading
            ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
            : data?.suggestions?.map((s, i) => (
                <Link
                  key={i}
                  to={`/dashboard?category=${encodeURIComponent(s.category)}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-[0_4px_20px_rgba(109,40,217,0.05)] hover:shadow-[0_8px_28px_rgba(109,40,217,0.12)] hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Category image */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={CATEGORY_IMAGES[s.category] || CATEGORY_IMAGES.Other}
                      alt={s.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Emoji + category badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="text-white text-xs font-bold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {s.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{s.reason}</p>
                    <div className="flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all">
                      Browse {s.category} events <FiArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>

        {/* No bio nudge — shown after fetch if bio was empty */}
        {!loading && data && !user.bio && (
          <p className="text-center text-xs text-on-surface-variant mt-6">
            These are general picks.{' '}
            <Link to="/profile" className="text-primary font-semibold hover:underline">
              Add a bio
            </Link>{' '}
            for personalised recommendations.
          </p>
        )}
      </div>
    </section>
  );
}
