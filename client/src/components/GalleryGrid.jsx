import { useState, useRef } from 'react';
import { FiUpload, FiTrash2, FiX } from 'react-icons/fi';
import { uploadEventImage, deleteEventImage } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function GalleryGrid({ eventId, images = [], onUpdate, isHost }) {
  const { user }           = useAuth();
  const fileRef            = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox]   = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, path } = await uploadEventImage(eventId, file);
      const res = await api.post('/gallery/upload', {
        event_id: eventId,
        image_url: url,
        storage_path: path,
      });
      onUpdate?.([...images, res.data]);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img) => {
  if (!window.confirm('Delete this image?')) return;
  try {
    await api.delete(`/gallery/${img.id}`);
    onUpdate?.(images.filter((i) => i.id !== img.id));
    toast.success('Image deleted');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Delete failed');
  }
};

  return (
    <>
      <div className="gallery-grid">
        {/* Upload Button */}
        <button className="gallery-upload-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <div className="spinner" style={{ width: 24, height: 24 }} />
          ) : (
            <>
              <FiUpload size={22} />
              <span>Upload</span>
            </>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />

        {/* Images */}
        {images.map((img) => (
          <div key={img.id} className="gallery-item">
            <img src={img.image_url} alt="Event photo" onClick={() => setLightbox(img)} />
            {(isHost || img.uploaded_by === user?.id) && (
              <button
                onClick={() => handleDelete(img)}
                style={{
                  position: 'absolute', top: 6, right: 6,
                  background: 'rgba(0,0,0,0.6)', border: 'none',
                  borderRadius: '50%', width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer',
                }}
              >
                <FiTrash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setLightbox(null)}
        >
          <button
            style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            onClick={() => setLightbox(null)}
          >
            <FiX size={28} />
          </button>
          <img
            src={lightbox.image_url}
            alt="Full size"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
