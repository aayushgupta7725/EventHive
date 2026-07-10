import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiType, FiAlignLeft, FiLock, FiGlobe, FiImage, FiArrowLeft } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Music', 'Tech', 'Sports', 'Art', 'Food', 'Business', 'Gaming', 'Health', 'Education', 'Social', 'Other'];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    start_date: '', end_date: '', visibility: 'public', category: 'Other',
    cover_image: '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title)      e.title      = 'Title is required';
    if (!form.start_date) e.start_date = 'Start date is required';
    if (!form.end_date)   e.end_date   = 'End date is required';
    if (form.start_date && form.end_date && form.end_date <= form.start_date)
      e.end_date = 'End must be after start';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.post('/events', form);
      toast.success('Event created successfully! 🎉');
      navigate(`/events/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div style={{ paddingTop: 48, marginBottom: 36 }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 20, paddingLeft: 0 }}>
            <FiArrowLeft /> Back
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Host an Event</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Fill in the details to create your event</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Title */}
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 20 }}>📝 Event Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="ev-title">Event Title *</label>
                  <input id="ev-title" className="form-input" placeholder="Give your event a catchy title" value={form.title} onChange={set('title')} />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ev-desc">Description</label>
                  <textarea id="ev-desc" className="form-input form-textarea" placeholder="What's this event about? Who should attend?" value={form.description} onChange={set('description')} rows={4} />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={set('category')}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Visibility</label>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      {['public', 'private'].map((v) => (
                        <button
                          key={v} type="button"
                          className={`btn ${form.visibility === v ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                          style={{ flex: 1 }}
                          onClick={() => setForm(f => ({ ...f, visibility: v }))}
                        >
                          {v === 'public' ? <FiGlobe size={14} /> : <FiLock size={14} />}
                          {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cover">Cover Image URL</label>
                  <input id="cover" className="form-input" placeholder="https://..." value={form.cover_image} onChange={set('cover_image')} />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 20 }}>🗓️ Date & Time</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="start">Start Date & Time *</label>
                  <input id="start" type="datetime-local" className="form-input" value={form.start_date} onChange={set('start_date')} />
                  {errors.start_date && <span className="form-error">{errors.start_date}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="end">End Date & Time *</label>
                  <input id="end" type="datetime-local" className="form-input" value={form.end_date} onChange={set('end_date')} />
                  {errors.end_date && <span className="form-error">{errors.end_date}</span>}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 20 }}>📍 Location</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="location">Venue / Address</label>
                  <input id="location" className="form-input" placeholder="123 Main St, City, State" value={form.location} onChange={set('location')} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <div className="spinner" style={{ width: 22, height: 22 }} /> : '🚀 Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
