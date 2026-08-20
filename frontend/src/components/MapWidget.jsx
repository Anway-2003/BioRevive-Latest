import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Smooth Recenter with closer zoom level (15)
const RecenterAutomatically = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true }); // Closer zoom for buildings/lands
    }
  }, [center, map]);
  return null;
};

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
};

const MapWidget = ({ zones, onMapClick, center, mapType = 'satellite' }) => {
  return (
    <MapContainer 
      center={center || [19.6156, 77.7963]} 
      zoom={14} 
      maxZoom={19}
      minZoom={5}
      scrollWheelZoom={true} // 🔥 Mouse scroll zoom enabled
      style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 0 }}
    >
      {/* Satellite 3D vs Street Tile Switching with High Zoom Limit */}
      {mapType === 'satellite' ? (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          maxZoom={19}
          maxNativeZoom={19}
        />
      ) : (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          maxZoom={19}
        />
      )}
      
      <RecenterAutomatically center={center} />
      <MapEvents onMapClick={onMapClick} />

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