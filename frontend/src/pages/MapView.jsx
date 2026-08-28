import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, MapPin, Navigation, ChevronRight, Map as MapIcon, Globe, Sparkles, Crosshair, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HexagonDeadZoneMap from '../components/HexagonDeadZoneMap'; // 🚀 Team chi file

// --- CUSTOM ICONS ---
const createZoneIcon = (status) => {
  let color = '#10B981'; // Default Green (Healthy)
  if (status === 'Critical') color = '#EF4444'; // Red
  else if (status === 'High') color = '#F97316'; // Orange
  else if (status === 'Watch') color = '#EAB308'; // Yellow

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// 📍 LIVE LOCATION (Pulsing Blue Dot)
const userLocationIcon = L.divIcon({
  className: 'user-location-icon',
  html: `
    <div class="relative flex h-6 w-6 items-center justify-center">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md"></span>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// --- HELPER COMPONENTS ---
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && !isNaN(center[0])) {
      map.flyTo(center, 14, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const LocationMarker = ({ position }) => {
  return position === null ? null : (
    <Marker position={position} icon={userLocationIcon}>
      <Popup className="font-sans font-bold text-sm">📍 You are here</Popup>
    </Marker>
  );
};

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
};

const MapView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // States
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLatLng, setNewLatLng] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneStatus, setZoneStatus] = useState('Needs Attention');
  const [submitting, setSubmitting] = useState(false);
  
  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]); // Default: Pune
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isSearching, setIsSearching] = useState(false); 
  
  const [mapType, setMapType] = useState('satellite'); 
  const [viewMode, setViewMode] = useState('standard'); 
  
  const [userLoc, setUserLoc] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const fetchZones = async () => {
    try {
      const response = await fetch('http://10.232.232.50:8080/api/zones');
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setZones(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Error fetching zones from Java API:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();

    if (location.state?.lat && location.state?.lng) {
      const parsedLat = parseFloat(location.state.lat);
      const parsedLng = parseFloat(location.state.lng);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        setMapCenter([parsedLat, parsedLng]);
      }
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter([latitude, longitude]);
            setUserLoc([latitude, longitude]);
          },
          () => console.log("Location access denied initially.")
        );
      }
    }
  }, [location.state]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      let data = [];
      if (response.ok) data = await response.json();

      if (data && data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        const fallbackRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1`);
        const fallbackData = await fallbackRes.json();
        if (fallbackData && fallbackData.features && fallbackData.features.length > 0) {
          const [lon, lat] = fallbackData.features[0].geometry.coordinates;
          setMapCenter([parseFloat(lat), parseFloat(lon)]);
        } else {
          alert("Location not found! Please try a different city or area name.");
        }
      }
    } catch (error) {
      alert("Error searching for location. Please check your internet connection.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLoc([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setIsLocating(false);
        },
        () => {
          alert("Please enable location permissions in your browser.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleMapClick = (latlng) => {
    if (viewMode === 'ai') return; 
    setNewLatLng(latlng);
    setIsModalOpen(true);
  };

  const handleSaveZone = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newZoneData = { name: zoneName, latitude: newLatLng.lat, longitude: newLatLng.lng, status: zoneStatus };
      const response = await fetch('http://10.232.232.50:8080/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZoneData)
      });
      if (!response.ok) throw new Error("Failed to save zone");
      setIsModalOpen(false);
      setZoneName('');
      fetchZones(); 
      alert('🔥 Success! New Zone saved successfully.');
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getZoneStyles = (status) => {
    switch (status) {
      case 'Critical': return { color: 'bg-red-500', textCol: 'text-red-500' };
      case 'High': return { color: 'bg-orange-500', textCol: 'text-orange-500' };
      case 'Watch': return { color: 'bg-yellow-500', textCol: 'text-yellow-500' };
      default: return { color: 'bg-green-500', textCol: 'text-green-500' };
    }
  };

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP MAP VIEW */}
      {isMobile && (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans relative flex flex-col">
          <div className="bg-[#114A29] text-white px-4 pt-5 pb-4 shadow-md z-10">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-xl font-extrabold flex items-center gap-2">
                <MapPin size={20} className="text-green-400" /> Live Map
              </h1>
              <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
                <button onClick={() => { setViewMode('standard'); setMapType('streets'); }} className={`p-1.5 rounded-lg text-[10px] font-bold transition ${viewMode === 'standard' && mapType === 'streets' ? 'bg-white text-[#114A29]' : 'text-white'}`}>2D</button>
                <button onClick={() => { setViewMode('standard'); setMapType('satellite'); }} className={`p-1.5 rounded-lg text-[10px] font-bold transition ${viewMode === 'standard' && mapType === 'satellite' ? 'bg-white text-[#114A29]' : 'text-white'}`}>3D</button>
                <button onClick={() => setViewMode('ai')} className={`p-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${viewMode === 'ai' ? 'bg-emerald-500 text-black' : 'text-emerald-300'}`}>
                  <Sparkles size={12} /> AI
                </button>
              </div>
            </div>
            
            {viewMode === 'standard' && (
              <>
                <div className="relative flex items-center">
                  <input 
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search locations..." 
                    className="w-full bg-white text-gray-900 text-xs pl-4 pr-[80px] py-2.5 rounded-xl outline-none shadow-inner font-medium"
                  />
                  <div className="absolute right-1 flex items-center gap-1">
                    <button onClick={handleSearch} disabled={isSearching} className="p-1.5 bg-gray-100 rounded-lg text-gray-500 cursor-pointer">
                      {isSearching ? <Loader2 size={14} className="animate-spin text-green-600" /> : <Search size={14} />}
                    </button>
                    <button onClick={handleLocateMe} className="p-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 cursor-pointer">
                      {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Crosshair size={14} />}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-green-200 mt-2 font-medium text-center">Click anywhere on map to add a zone</p>
              </>
            )}
          </div>

          <div className="relative w-full h-[60vh] min-h-[450px] bg-gray-200 overflow-hidden z-0 border-b border-gray-200">
            {viewMode === 'ai' ? (
              <div className="w-full h-full pt-4 relative ai-mobile-hud-fix">
                <HexagonDeadZoneMap center={mapCenter} onCenterChange={(c) => setMapCenter(c)} />
              </div>
            ) : (
              <MapContainer center={mapCenter} zoom={13} className="w-full h-full z-0" zoomControl={false}>
                <MapUpdater center={mapCenter} />
                <MapEvents onMapClick={handleMapClick} />
                {mapType === 'satellite' ? (
                  <>
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Tiles &copy; Esri" />
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />
                  </>
                ) : (
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
                )}
                <LocationMarker position={userLoc} />
                {zones.map((zone) => {
                  const lat = parseFloat(zone.latitude);
                  const lng = parseFloat(zone.longitude);
                  if (isNaN(lat) || isNaN(lng)) return null;
                  return (
                    <Marker key={zone.id || Math.random()} position={[lat, lng]} icon={createZoneIcon(zone.status || 'OK')}>
                      <Popup className="font-sans"><div className="p-1"><h3 className="font-black text-gray-900 text-sm">{zone.name || 'Zone'}</h3><p className="text-xs text-gray-500 font-bold mb-2">Status: <span className={zone.status==='Critical'?'text-red-500':'text-green-500'}>{zone.status || 'Healthy'}</span></p></div></Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>

          <div className="px-4 py-4 space-y-3 bg-white rounded-t-3xl -mt-6 shadow-lg relative z-20 min-h-[300px]">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Active Zones (Java Backend)</h3>
            {loading ? <div className="text-center text-xs font-bold text-gray-400 mt-5">Loading from Server...</div> 
            : zones.length === 0 ? <div className="text-center text-xs font-bold text-gray-400 mt-5">No zones found.</div>
            : zones.map((zone) => {
              const statusStr = zone.status || 'Adopted';
              const styles = getZoneStyles(statusStr);
              return (
                <div key={zone.id} onClick={() => navigate(`/zone/${zone.id}`)} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-green-50/50 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${styles.color}/10 ${styles.textCol} flex items-center justify-center font-black text-xs uppercase`}>{statusStr.substring(0,2)}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{zone.name}</h4>
                      <p className={`text-xs font-semibold ${styles.textCol} flex items-center gap-1`}>● {statusStr}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 💻 2. DESKTOP / WEB MAP VIEW */}
      {!isMobile && (
        <div className="flex flex-row h-screen bg-gray-50 overflow-hidden font-sans w-full relative">
          <div className="flex-1 relative z-0 bg-gray-200">
            
            {viewMode === 'standard' && (
              <div className="absolute top-6 left-6 z-[400] bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3 w-80 md:w-96 border border-gray-100">
                <input 
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search locations..." className="w-full outline-none text-sm font-bold text-gray-700 bg-transparent" 
                />
                {isSearching ? <Loader2 size={18} className="text-green-600 animate-spin" /> : <Search onClick={handleSearch} size={18} className="text-gray-400 cursor-pointer hover:text-green-700 transition" />}
                <div className="border-l border-gray-200 pl-3">
                  <button onClick={handleLocateMe} className="text-blue-600 hover:text-blue-800 transition cursor-pointer" title="Locate Me">
                    {isLocating ? <Loader2 size={18} className="animate-spin" /> : <Crosshair size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* 🔥 VARTCHI WHITE LINE (ALWAYS ON TOP) 🔥 */}
            <div className="absolute top-6 right-6 z-[500] bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-gray-200 flex gap-1">
              <button onClick={() => { setViewMode('standard'); setMapType('streets'); }} className={`px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${viewMode === 'standard' && mapType === 'streets' ? 'bg-[#114A29] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>🗺️ Street View</button>
              <button onClick={() => { setViewMode('standard'); setMapType('satellite'); }} className={`px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${viewMode === 'standard' && mapType === 'satellite' ? 'bg-[#114A29] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>🛰️ Satellite 3D</button>
              <button onClick={() => setViewMode('ai')} className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 ${viewMode === 'ai' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-emerald-600 hover:bg-emerald-50'}`}><Sparkles size={16} /> AI Hexagon Radar</button>
            </div>

            {viewMode === 'standard' && (
              <div className="absolute top-20 left-6 z-[400] bg-[#114A29] text-white rounded-xl shadow-md px-4 py-2 text-xs font-bold border border-green-800">
                Click anywhere on the map to add a new zone
              </div>
            )}

            {viewMode === 'standard' && (
              <div className="absolute bottom-6 left-6 z-[400] bg-white rounded-xl shadow-md p-5 w-56 border border-gray-100">
                <h4 className="font-extrabold text-sm text-gray-800 mb-4">Legend</h4>
                <div className="space-y-3 text-xs font-bold text-gray-600">
                  <div className="flex items-center gap-3"><span className="relative flex h-4 w-4 justify-center items-center"><span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30 scale-150"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span></span> Critical</div>
                  <div className="flex items-center gap-3"><span className="relative flex h-4 w-4 justify-center items-center"><span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-30 scale-150"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span></span> High</div>
                  <div className="flex items-center gap-3"><span className="relative flex h-4 w-4 justify-center items-center"><span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-30 scale-150"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span></span> Watch</div>
                  <div className="flex items-center gap-3"><span className="relative flex h-4 w-4 justify-center items-center"><span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 scale-150"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span></span> Healthy</div>
                </div>
              </div>
            )}

            <div className="w-full h-full z-0 relative">
              {viewMode === 'ai' ? (
                // 🔥 FIXED: SHIFTED ENTIRE MODULE DOWN BY 80px 🔥
                <div className="absolute top-[80px] left-0 right-0 bottom-0">
                  <HexagonDeadZoneMap center={mapCenter} onCenterChange={(c) => setMapCenter(c)} />
                </div>
              ) : (
                <MapContainer center={mapCenter} zoom={13} className="w-full h-full z-0" zoomControl={false}>
                  <MapUpdater center={mapCenter} />
                  <MapEvents onMapClick={handleMapClick} />
                  {mapType === 'satellite' ? (
                    <>
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Tiles &copy; Esri" />
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />
                    </>
                  ) : (
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
                  )}
                  <LocationMarker position={userLoc} />
                  {zones.map((zone) => {
                    const lat = parseFloat(zone.latitude);
                    const lng = parseFloat(zone.longitude);
                    if (isNaN(lat) || isNaN(lng)) return null;
                    return (
                      <Marker key={zone.id || Math.random()} position={[lat, lng]} icon={createZoneIcon(zone.status || 'OK')}>
                        <Popup className="font-sans">
                          <div className="p-1">
                            <h3 className="font-black text-gray-900 text-sm">{zone.name || 'Zone'}</h3>
                            <p className="text-xs text-gray-500 font-bold mb-2">Status: <span className={zone.status==='Critical'?'text-red-500':'text-green-500'}>{zone.status || 'Healthy'}</span></p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
            </div>
          </div>

          <div className="w-80 bg-white shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.1)] z-10 flex flex-col border-l border-gray-100 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-lg text-gray-800">Filters & Zones</h3>
                <button className="text-gray-400 hover:text-gray-800 transition cursor-pointer"><X size={20} /></button>
              </div>

              <h4 className="font-bold text-sm text-gray-800 mb-3">Java Database List</h4>
              <div className="space-y-3 mb-8">
                 {loading ? <div className="text-xs text-gray-400 font-bold">Loading...</div>
                 : zones.length === 0 ? <div className="text-xs text-gray-400 font-bold">No zones found.</div>
                 : zones.map(zone => {
                   const statusStr = zone.status || 'Adopted';
                   const styles = getZoneStyles(statusStr);
                   return (
                    <div key={zone.id} onClick={() => navigate(`/zone/${zone.id}`)} className="p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-green-50 transition">
                       <h4 className="font-bold text-gray-900 text-sm">{zone.name}</h4>
                       <p className={`text-xs font-bold ${styles.textCol} mt-1`}>● {statusStr}</p>
                    </div>
                   )
                 })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 ADD NEW ZONE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2"><MapIcon className="text-green-600" size={20} /> Add Zone Here</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
            </div>
            <p className="text-xs text-gray-500 font-bold mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
              📍 Lat: {newLatLng?.lat?.toFixed(5)}, Lng: {newLatLng?.lng?.toFixed(5)} 
            </p>
            <form onSubmit={handleSaveZone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Zone Name</label>
                <input type="text" value={zoneName} onChange={(e) => setZoneName(e.target.value)} placeholder="e.g. Yavatmal Central Park" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600 transition" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Status</label>
                <select value={zoneStatus} onChange={(e) => setZoneStatus(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600 cursor-pointer">
                  <option value="Critical">🔴 Critical (Immediate Action)</option>
                  <option value="High">🟠 High Priority</option>
                  <option value="Watch">🟡 Watch / Planning</option>
                  <option value="Needs Attention">🟢 Needs Attention (Low)</option>
                </select>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-4 disabled:opacity-70 cursor-pointer">
                {submitting ? 'Saving to Java Server...' : 'Save Zone'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 CSS HACK FOR TEAM'S OVERLAYS ON MOBILE 🔥 */}
      <style>{`
        @media (max-width: 768px) {
          .ai-map-wrapper > div > div:not(.leaflet-container) {
            width: 94vw !important;
            max-width: 94vw !important;
            left: 3vw !important;
            right: auto !important;
            overflow-x: auto !important; 
            -webkit-overflow-scrolling: touch !important;
          }
          .ai-map-wrapper > div > div:not(.leaflet-container)::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MapView;