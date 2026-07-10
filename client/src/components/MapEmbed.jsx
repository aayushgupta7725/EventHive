import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin } from 'react-icons/fi';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapEmbed({ location }) {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState(location ? 'loading' : 'empty');

  useEffect(() => {
    if (!location) { setStatus('empty'); return; }
    setStatus('loading');

    const controller = new AbortController();
    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`, {
      signal: controller.signal,
      headers: { 'Accept-Language': 'en' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data[0]) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setStatus('ok');
        } else {
          setStatus('notfound');
        }
      })
      .catch(() => setStatus('notfound'));

    return () => controller.abort();
  }, [location]);

  if (status === 'loading') {
    return (
      <div className="map-container">
        <div className="spinner" style={{ width: 24, height: 24 }} />
      </div>
    );
  }

  if (status === 'ok' && coords) {
    return (
      <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', isolation: 'isolate' }}>
        <MapContainer center={coords} zoom={14} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords}>
            <Popup>{location}</Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }

  return (
    <div className="map-container" style={{ flexDirection: 'column', gap: 8 }}>
      <FiMapPin size={28} style={{ color: 'var(--accent-primary)', opacity: 0.7 }} />
      <span style={{ fontWeight: 600 }}>{location || 'Location not set'}</span>
      {status === 'notfound' && (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Couldn't find this location on the map
        </span>
      )}
    </div>
  );
}