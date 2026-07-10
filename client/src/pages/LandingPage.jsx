import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiMessageCircle, FiImage, FiMap, FiBell, FiArrowRight, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import AISuggestions from '../components/AISuggestions';

const FEATURES = [
  { icon: '📅', title: 'Create Events', desc: 'Host public or private events in minutes. Set date, location, and invite your crowd.' },
  { icon: '🔍', title: 'Discover Events', desc: 'Browse and search upcoming events near you. Filter by category, date, or type.' },
  { icon: '✅', title: 'RSVP Management', desc: 'Accept, decline, or mark "maybe". See full guest lists and track attendance.' },
  { icon: '💬', title: 'Real-time Chat', desc: 'Every event has its own chat room powered by Firebase for instant messaging.' },
  { icon: '📸', title: 'Media Gallery', desc: 'Upload and share photos from your event. Build memories that last.' },
  { icon: '🗺️', title: 'Google Maps', desc: 'View exact event locations on an embedded map. Never get lost again.' },
  { icon: '📆', title: 'Calendar Sync', desc: 'Add events directly to your Google Calendar with one click.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Get timely reminders and updates via Firebase Cloud Messaging.' },
];

const STATS = [
  { value: '10K+', label: 'Events Hosted' },
  { value: '50K+', label: 'Happy Users' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default function LandingPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
     {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32 px-6">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary/10 text-tertiary text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-tertiary animate-pulse" />
              Introducing EventHive 1.0
            </div>

            <h1 className="font-sans text-5xl lg:text-[48px] font-extrabold text-on-surface mb-6 leading-tight">
              Transforming Ideas into <span className="text-primary italic">Global Gatherings</span>
            </h1>

            <p className="text-lg text-on-surface-variant mb-10 max-w-2xl">
              Create, discover, and manage events effortlessly. From intimate gatherings to
              large conferences — EventHive has everything you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-primary-container text-on-primary text-sm font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                Start for Free
              </Link>
              <Link
                to="/dashboard"
                className="bg-secondary-container text-primary text-sm font-semibold px-8 py-4 rounded-xl hover:bg-secondary-container/80 transition-colors flex items-center justify-center gap-2"
              >
                Browse Events <FiArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
           <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 aspect-[4/3]">
              <img src="/hero-image.jpg" alt="EventHive" className="w-full h-full object-cover" />
           </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-tertiary-container/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-container px-6 py-12">
        <div className="max-w-[1280px] mx-auto flex flex-wrap justify-between gap-8 md:px-12">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-2xl font-bold text-primary">{s.value}</span>
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </section>


      {/* AI Suggestions */}
      <AISuggestions />

     {/* Features */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-[32px] font-bold text-on-surface mb-4">
              Everything you need to <span className="text-primary">plan &amp; connect</span>
            </h2>
            <p className="text-base text-on-surface-variant max-w-xl mx-auto">
              A complete event management toolkit built for communities, clubs, businesses, and individuals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 border border-outline-variant/30 shadow-[0_4px_20px_rgba(109,40,217,0.05)] hover:shadow-[0_4px_24px_rgba(109,40,217,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-2xl mb-6">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2">{f.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
    <section className="py-24 px-6 text-center bg-primary-container relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative z-10">
        <h2 className="text-3xl lg:text-[32px] font-bold text-white mb-4">
          Ready to host your next event?
        </h2>
        <p className="text-base text-white/80 max-w-xl mx-auto mb-10">
          Join thousands of organizers already using EventHive to create unforgettable experiences.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-white text-primary text-sm font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
        >
          Get Started Free <FiArrowRight size={18} />
        </Link>
      </div>
    </section>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-7">
      <div className="max-w-[1280px] mx-auto px-6 flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-2 font-bold text-on-surface">
          🐝 Event<span className="text-primary">Hive</span>
        </div>
      </div>
    </footer>
    </div>
  );
}
