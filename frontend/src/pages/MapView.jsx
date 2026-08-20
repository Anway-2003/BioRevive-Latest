import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, MapPin, Filter, Layers, Navigation, ChevronRight, Map as MapIcon, Globe } from 'lucide-react';
import MapWidget from '../components/MapWidget'; 

const MapView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLatLng, setNewLatLng] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneStatus, setZoneStatus] = useState('Needs Attention');
  const [submitting, setSubmitting] = useState(false);
  
  const [mapCenter, setMapCenter] = useState([19.6156, 77.7963]); // Default Location
  const [searchQuery, setSearchQuery] = useState(''); 
  const [mapType, setMapType] = useState('satellite'); // 🔥 SATELLITE VIEW STATE ADD KELA AHE

  const fetchZones = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/zones');
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setZones(data || []);
    } catch (error) {
      console.error("Error fetching zones from Java API:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();

    if (location.state?.lat && location.state?.lng) {
      setMapCenter([parseFloat(location.state.lat), parseFloat(location.state.lng)]);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Location blocked/failed. Using default.", error.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [location.state]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Location not found! Please try a different name.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location.");
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
        () => alert("Please allow location access in your browser!")
      );
    }
  };

  const handleMapClick = (latlng) => {
    setNewLatLng(latlng);
    setIsModalOpen(true);
  };

  const handleSaveZone = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newZoneData = {
        name: zoneName,
        latitude: newLatLng.lat,
        longitude: newLatLng.lng,
        status: zoneStatus
      };

      const response = await fetch('http://localhost:8080/api/zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newZoneData)
      });

      if (!response.ok) throw new Error("Failed to save zone in Java Backend");
      
      setIsModalOpen(false);
      setZoneName('');
      fetchZones(); 
      alert('🔥 Success! New Zone saved successfully to the database.');
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
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] pb-24 font-sans relative flex flex-col">
        <div className="bg-[#114A29] text-white px-4 pt-5 pb-4 shadow-md z-10">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-extrabold flex items-center gap-2">
              <MapPin size={20} className="text-green-400" /> Live Satellite Map
            </h1>
            <div className="flex gap-2">
              {/* Mobile Satellite Toggle */}
              <button 
                onClick={() => setMapType(prev => prev === 'satellite' ? 'streets' : 'satellite')}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Globe size={16} /> {mapType === 'satellite' ? '3D' : '2D'}
              </button>
            </div>
          </div>
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search locations..." 
              className="w-full bg-white text-gray-900 text-xs pl-4 pr-10 py-2.5 rounded-xl outline-none shadow-inner font-medium"
            />
            <button onClick={handleSearch} className="absolute right-2 p-1.5 bg-green-50 rounded-lg text-green-700 cursor-pointer">
              <Search size={14} />
            </button>
          </div>
          <p className="text-[10px] text-green-200 mt-2 font-medium text-center">Click anywhere on map to add a zone</p>
        </div>

        <div className="relative w-full h-[55vh] min-h-[400px] bg-gray-200 overflow-hidden z-0 border-b border-gray-200">
           <MapWidget zones={zones} onMapClick={handleMapClick} center={mapCenter} mapType={mapType} />
           
          <div className="absolute right-4 bottom-10 flex flex-col gap-2 z-[400]">
            <button onClick={handleLocateMe} className="w-10 h-10 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#114A29] font-bold hover:bg-gray-50 cursor-pointer">
              <Navigation size={18} />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-3 bg-white rounded-t-3xl -mt-6 shadow-lg relative z-20 min-h-[300px]">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Active Zones (Java Backend)</h3>
          
          {loading ? (
            <div className="text-center text-xs font-bold text-gray-400 mt-5">Loading from Server...</div>
          ) : zones.length === 0 ? (
            <div className="text-center text-xs font-bold text-gray-400 mt-5">No zones found. Add one on the map!</div>
          ) : zones.map((zone) => {
            const styles = getZoneStyles(zone.status);
            return (
              <div 
                key={zone.id} 
                onClick={() => navigate(`/zone/${zone.id}`)}
                className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-green-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${styles.color}/10 ${styles.textCol} flex items-center justify-center font-black text-xs uppercase`}>
                    {zone.status.substring(0,2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{zone.name}</h4>
                    <p className={`text-xs font-semibold ${styles.textCol} flex items-center gap-1`}>
                      ● {zone.status} • Lat: {zone.latitude.toFixed(2)}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            )
          })}
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB MAP VIEW */}
      <div className="hidden md:flex flex-row h-screen bg-gray-50 overflow-hidden font-sans w-full relative">
        <div className="flex-1 relative z-0">
          
          {/* Search Bar */}
          <div className="absolute top-6 left-6 z-[400] bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3 w-80 md:w-96 border border-gray-100">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search locations..." 
              className="w-full outline-none text-sm font-bold text-gray-700 bg-transparent" 
            />
            <Search onClick={handleSearch} size={18} className="text-gray-400 cursor-pointer hover:text-green-700 transition" />
            
            <div className="border-l border-gray-200 pl-3">
              <Navigation onClick={handleLocateMe} size={18} className="text-[#114A29] cursor-pointer hover:text-green-600 transition" title="Go to my location" />
            </div>
          </div>

          {/* 🛰️ SATELLITE VS STREET TOGGLE (Desktop Top-Right) */}
          <div className="absolute top-6 right-6 z-[400] bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-gray-200 flex gap-1">
            <button 
              onClick={() => setMapType('satellite')}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                mapType === 'satellite' ? 'bg-[#114A29] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🛰️ Satellite 3D
            </button>
            <button 
              onClick={() => setMapType('streets')}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                mapType === 'streets' ? 'bg-[#114A29] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🗺️ Street View
            </button>
          </div>

          <div className="absolute top-20 left-6 z-[400] bg-[#114A29] text-white rounded-xl shadow-md px-4 py-2 text-xs font-bold border border-green-800">
            Click anywhere on the map to add a new zone
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 z-[400] bg-white rounded-xl shadow-md p-5 w-56 border border-gray-100">
            <h4 className="font-extrabold text-sm text-gray-800 mb-4">Legend</h4>
            <div className="space-y-3 text-xs font-bold text-gray-600">
              <div className="flex items-center gap-3"><span className="relative flex h-4 w-4 justify-center items-center"><span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30 scale-150"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span></span> Critical</div>
              <div className="flex items-center gap-3"><span className="relative flex h-4 w-4 justify-center items-center"><span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-30 scale-150"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span></span> High</div>
              <div className="flex items-center gap-3"><span className="relative flex h-4 w-4 justify-center items-center"><span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-30 scale-150"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span></span> Watch</div>
              <div className="flex items-center gap-3"><span className="relative flex h-4 w-4 justify-center items-center"><span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 scale-150"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span></span> Healthy</div>
            </div>
          </div>

          {/* Map Widget Component Pass mapType */}
          <div className="w-full h-full z-0 relative">
             <MapWidget zones={zones} onMapClick={handleMapClick} center={mapCenter} mapType={mapType} />
          </div>
        </div>

        {/* Sidebar List */}
        <div className="w-80 bg-white shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.1)] z-10 flex flex-col border-l border-gray-100 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg text-gray-800">Filters & Zones</h3>
              <button className="text-gray-400 hover:text-gray-800 transition cursor-pointer"><X size={20} /></button>
            </div>

            <h4 className="font-bold text-sm text-gray-800 mb-3">Java Database List</h4>
            <div className="space-y-3 mb-8">
               {loading ? (
                 <div className="text-xs text-gray-400 font-bold">Loading...</div>
               ) : zones.length === 0 ? (
                 <div className="text-xs text-gray-400 font-bold">No zones found.</div>
               ) : zones.map(zone => {
                 const styles = getZoneStyles(zone.status);
                 return (
                  <div 
                    key={zone.id} 
                    onClick={() => navigate(`/zone/${zone.id}`)}
                    className="p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-green-50 transition"
                  >
                     <h4 className="font-bold text-gray-900 text-sm">{zone.name}</h4>
                     <p className={`text-xs font-bold ${styles.textCol} mt-1`}>● {zone.status}</p>
                  </div>
                 )
               })}
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 SHARED MODAL: ADD NEW ZONE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <MapIcon className="text-green-600" size={20} /> Add Zone Here
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
            </div>
            <p className="text-xs text-gray-500 font-bold mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
              📍 Lat: {newLatLng?.lat.toFixed(5)}, Lng: {newLatLng?.lng.toFixed(5)}
            </p>
            <form onSubmit={handleSaveZone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Zone Name</label>
                <input 
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g. Yavatmal Central Park"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Status</label>
                <select 
                  value={zoneStatus}
                  onChange={(e) => setZoneStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600 cursor-pointer"
                >
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

    </div>
  );
};

export default MapView;