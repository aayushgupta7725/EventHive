import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiGlobe, FiLock, FiUpload } from 'react-icons/fi';
import api from '../services/api';
import { uploadEventImage } from '../services/firebase';
import toast from 'react-hot-toast';

const CATEGORIES = ['Music', 'Tech', 'Sports', 'Art', 'Food', 'Business', 'Gaming', 'Health', 'Education', 'Social', 'Other'];

// datetime-local input requires "YYYY-MM-DDTHH:mm" format
function toDatetimeLocal(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEventPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    start_date: '', end_date: '', visibility: 'public', category: 'Other',
    cover_image: '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [coverPreviewError, setCoverPreviewError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const ev = res.data.event;
        setForm({
          title:       ev.title       || '',
          description: ev.description || '',
          location:    ev.location    || '',
          start_date:  toDatetimeLocal(ev.start_date),
          end_date:    toDatetimeLocal(ev.end_date),
          visibility:  ev.visibility  || 'public',
          category:    ev.category    || 'Other',
          cover_image: ev.cover_image || '',
        });
        setCoverPreviewError(false);
      } catch {
        toast.error('Failed to load event');
        navigate(-1);
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [id]);

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: '' }));
    if (key === 'cover_image') setCoverPreviewError(false);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadEventImage('covers', file);
      setForm(f => ({ ...f, cover_image: url }));
      setCoverPreviewError(false);
      toast.success('Cover image uploaded!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
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
      await api.put(`/events/${id}`, form);
      toast.success('Event updated!');
      navigate(`/events/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page-content loading-overlay">
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div style={{ paddingTop: 48, marginBottom: 36 }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 20, paddingLeft: 0 }}>
            <FiArrowLeft /> Back
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Edit Event</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Update the details for your event</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Event Info */}
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
                  <textarea id="ev-desc" className="form-input form-textarea" placeholder="What's this event about?" value={form.description} onChange={set('description')} rows={4} />
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
                  <label className="form-label" htmlFor="cover">Cover Image</label>
                  <input id="cover" className="form-input" placeholder="Paste an image URL, or upload a file below" value={form.cover_image} onChange={set('cover_image')} />

                  {/* File upload */}
                  <div style={{ marginTop: 8 }}>
                    <label
                      htmlFor="cover-file-edit"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        fontSize: '0.82rem', fontWeight: 600,
                        color: 'var(--primary)', opacity: uploading ? 0.6 : 1,
                      }}
                    >
                      {uploading
                        ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Uploading…</>
                        : <><FiUpload size={14} /> Upload from device</>
                      }
                    </label>
                    <input id="cover-file-edit" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} disabled={uploading} />
                  </div>

                  {/* Live preview */}
                  {form.cover_image && !coverPreviewError && (
                    <img
                      src={form.cover_image}
                      alt="Cover preview"
                      onError={() => setCoverPreviewError(true)}
                      style={{ marginTop: 12, width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--outline-variant)' }}
                    />
                  )}
                  {form.cover_image && coverPreviewError && (
                    <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--error)' }}>
                      ⚠️ This URL could not be loaded. Try a direct image link or upload a file instead.
                    </p>
                  )}
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
              <div className="form-group">
                <label className="form-label" htmlFor="location">Venue / Address</label>
                <input id="location" className="form-input" placeholder="123 Main St, City, State" value={form.location} onChange={set('location')} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn btn-secondary btn-lg" style={{ flex: 1 }} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }} disabled={loading}>
                {loading ? <div className="spinner" style={{ width: 22, height: 22 }} /> : '💾 Save Changes'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
