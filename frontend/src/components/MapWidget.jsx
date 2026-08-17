import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// React-Leaflet madhe default icon disnyasathi he setting lagte
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 🚀 Map automatic navya location var set karnyasti function
const RecenterAutomatically = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { animate: true }); // Smooth zoom-in animation
    }
  }, [center, map]);
  return null;
};

// Map var click kelyavar kay vhayla hava, te handle karnara function
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng); // Click keleli jagachi (Lat/Lng) pathvto
    },
  });
  return null;
};

const MapWidget = ({ zones, onMapClick, center }) => {
  return (
    <MapContainer 
      center={center || [19.6156, 77.7963]} // Dhanki by default
      zoom={12} 
      style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 0 }}
    >
      {/* Map cha background (OpenStreetMap) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {/* 🚀 Location change zali ki map update hoil */}
      <RecenterAutomatically center={center} />
      
      {/* Click event register karne */}
      <MapEvents onMapClick={onMapClick} />

      {/* Supabase madhun aalele zones Map var Pin (Marker) mhanun dakhvne */}
      {zones && zones.map((zone) => (
        <Marker key={zone.id} position={[zone.latitude, zone.longitude]}>
          <Popup>
            <strong>{zone.name}</strong><br/>
            Status: {zone.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWidget;