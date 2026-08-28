import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Factory, 
  TestTubes, 
  TreePine, 
  Droplets,
  Map as MapIcon,
  ShieldAlert,
  MapPin, 
  AlertTriangle, 
  Activity, 
  Sprout, 
  ArrowRight, 
  Camera, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const ZoneDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdoptedLocally, setIsAdoptedLocally] = useState(false);
  
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const zoneImages = [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80'
  ];

  useEffect(() => {
    const fetchZoneDetails = async () => {
      try {
        const response = await fetch('http://https://biorevive-backend-6yij.onrender.com/api/zones');
        if (response.ok) {
          const listData = await response.json();
          const found = listData.find(z => String(z.id) === String(id));
          if (found) {
            setZone(found);
          }
        }
      } catch (error) {
        console.error("Error fetching zone details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchZoneDetails();

    if (localStorage.getItem(`adopted_zone_${id}`) === 'true') {
      setIsAdoptedLocally(true);
    }
  }, [id]);

  const zoneName = zone?.name || `Ecological Zone #${id}`;
  const rawStatus = zone?.status || 'Critical';
  const isAdopted = isAdoptedLocally || rawStatus.toLowerCase() === 'adopted';
  const zoneStatus = isAdopted ? 'Adopted' : rawStatus;

  const zoneLat = zone?.latitude ? zone.latitude : 18.5547;
  const zoneLng = zone?.longitude ? zone.longitude : 73.9401;

  const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % zoneImages.length);
  const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + zoneImages.length) % zoneImages.length);

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen font-sans pb-24 relative">
        <div className="relative h-72 w-full">
          <img 
            src={zoneImages[currentImageIdx]} 
            alt="Zone Overview" 
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent"></div>
          
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <button onClick={() => navigate('/map')} className="bg-white/20 backdrop-blur-md text-white p-2 rounded-xl">
              <ChevronLeft size={24} />
            </button>
            <span className={`${isAdopted ? 'bg-green-600' : 'bg-red-500/90'} text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm`}>
              {zoneStatus}
            </span>
          </div>

          <div className="absolute bottom-6 left-4 right-4 text-white z-10">
            <h1 className="text-2xl font-black leading-tight mb-1">{zoneName}</h1>
            <p className="text-xs font-semibold text-gray-200 flex items-center gap-1">
              <MapPin size={12} className="text-green-400" /> Lat: {zoneLat.toFixed(4)}, Lng: {zoneLng.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="px-4 py-5 space-y-4 -mt-4 relative z-20 bg-[#F8FAFC] rounded-t-3xl">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Activity size={18} className="mx-auto text-red-500 mb-1" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">Health</p>
              <p className="text-sm font-black text-gray-900">{isAdopted ? '45%' : '12%'}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Sprout size={18} className="mx-auto text-[#114A29] mb-1" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">Flora Lost</p>
              <p className="text-sm font-black text-gray-900">{isAdopted ? '30%' : '85%'}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <ShieldAlert size={18} className="mx-auto text-green-600 mb-1" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
              <p className="text-sm font-black text-gray-900">{isAdopted ? 'Adopted' : 'Open'}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button onClick={() => navigate('/ai-analysis')} className="w-full bg-[#114A29] text-white py-4 rounded-2xl font-extrabold shadow-lg hover:bg-green-800 transition flex items-center justify-between px-5">
              <span className="flex items-center gap-2"><Sparkles size={18} /> View AI Analysis</span>
              <ArrowRight size={18} />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate(`/adopt/${id}`)} 
                className={`border-2 py-3 rounded-xl font-extrabold flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer ${isAdopted ? 'bg-green-50 border-green-600 text-green-800' : 'bg-white border-[#114A29] text-[#114A29]'}`}
              >
                <Sprout size={20} /> <span className="text-xs">{isAdopted ? 'Adopted ✓' : 'Adopt Zone'}</span>
              </button>
              <button onClick={() => navigate('/upload')} className="bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-extrabold flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer">
                <Camera size={20} /> <span className="text-xs">Update Photos</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-8 max-w-7xl mx-auto">
        
        <div className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500">
          <button onClick={() => navigate('/map')} className="hover:text-[#114A29] transition flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
            <ChevronLeft size={16} /> Back to Map
          </button>
        </div>

        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-green-100 text-[#114A29] text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">Verified Zone</span>
              <span className="text-xs font-bold text-gray-400">ID: #{id}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{zoneName}</h1>
            <p className="text-gray-500 font-medium text-xs mt-1">Coordinates: {zoneLat.toFixed(4)}° N, {zoneLng.toFixed(4)}° E</p>
          </div>
          <div className={`${isAdopted ? 'bg-green-600' : 'bg-red-500'} text-white px-6 py-2.5 rounded-2xl font-black shadow-md uppercase tracking-wider text-sm flex items-center gap-2`}>
            {isAdopted ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />} {zoneStatus}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-md border border-gray-100 group bg-gray-900 h-[360px]">
            <img 
              src={zoneImages[currentImageIdx]} 
              alt="Dead Zone Overview" 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-2xl backdrop-blur-md transition cursor-pointer shadow-lg">
              <ChevronLeft size={22} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-2xl backdrop-blur-md transition cursor-pointer shadow-lg">
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
              <span className="bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/10">
                📸 Photo {currentImageIdx + 1} of {zoneImages.length} • High-Resolution Satellite View
              </span>
              <div className="flex gap-1.5">
                {zoneImages.map((_, i) => (
                  <span key={i} className={`h-2 rounded-full transition-all ${i === currentImageIdx ? 'w-6 bg-green-400' : 'w-2 bg-white/50'}`}></span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden group hover:border-green-200 transition">
              <div className="absolute -right-4 -bottom-4 text-gray-50 group-hover:text-green-50 transition">
                <Activity size={80} />
              </div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1">Severity Score</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{isAdopted ? '34%' : '92%'}</h2>
              <span className={`text-[10px] font-bold ${isAdopted ? 'text-green-600' : 'text-red-500'} mt-2`}>
                {isAdopted ? 'Revival in Progress' : 'Critical Level'}
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden group hover:border-green-200 transition">
              <div className="absolute -right-4 -bottom-4 text-gray-50 group-hover:text-green-50 transition">
                <TreePine size={80} />
              </div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1">Biodiversity</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{isAdopted ? '65' : '18'}<span className="text-base text-gray-400">/100</span></h2>
              <span className={`text-[10px] font-bold ${isAdopted ? 'text-green-600' : 'text-orange-500'} mt-2`}>
                {isAdopted ? 'Improving' : 'Severe Loss'}
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1">Total Area</p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">12.4 ha</h2>
              <span className="text-[10px] font-bold text-gray-500 mt-2">Mapped Sector</span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1">Adoption Status</p>
              <div className="flex items-center gap-2 mt-1">
                {isAdopted ? <CheckCircle2 size={18} className="text-green-600" /> : <ShieldAlert size={18} className="text-amber-500" />}
                <h2 className="text-base font-black text-gray-800">{isAdopted ? 'Adopted' : 'Unadopted'}</h2>
              </div>
              <span className="text-[10px] font-bold text-green-600 mt-1">
                {isAdopted ? 'Managed by Community' : 'Ready for Community'}
              </span>
            </div>
          </div>

        </div>

        {/* Primary Action Bar */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <button onClick={() => navigate('/ai-analysis')} className="bg-[#114A29] hover:bg-green-900 text-white py-4 px-6 rounded-2xl font-black shadow-lg shadow-green-900/10 transition flex items-center justify-center gap-3 cursor-pointer group">
            <Sparkles size={20} className="text-green-300 group-hover:scale-110 transition" /> View AI Deep Analysis
          </button>
          
          <button 
            onClick={() => navigate(`/adopt/${id}`)} 
            className={`py-4 px-6 rounded-2xl font-black transition flex items-center justify-center gap-3 cursor-pointer ${isAdopted ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-green-50 hover:bg-green-100 text-[#114A29] border border-green-200'}`}
          >
            <Sprout size={20} /> {isAdopted ? 'Already Adopted (View)' : 'Adopt This Zone Now'}
          </button>

          <button onClick={() => navigate('/upload')} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-4 px-6 rounded-2xl font-black transition flex items-center justify-center gap-3 cursor-pointer shadow-xs">
            <Camera size={20} className="text-gray-500" /> Update Live Photos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={22} /> Primary Ecological Causes
            </h3>
            <div className="space-y-4">
              {[
                { icon: Factory, label: 'Industrial Waste Runoff', impact: 'High Impact' },
                { icon: TestTubes, label: 'Severe Soil Chemical Contamination', impact: 'Critical' },
                { icon: TreePine, label: 'Massive Vegetation Loss', impact: 'High Impact' },
                { icon: Droplets, label: 'Groundwater Contamination', impact: 'Critical' }
              ].map((cause, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 transition group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-xs group-hover:bg-green-100 transition text-[#114A29]">
                      <cause.icon size={20} />
                    </div>
                    <span className="font-extrabold text-gray-800 text-sm">{cause.label}</span>
                  </div>
                  <span className="text-xs font-black text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {cause.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-[#114A29]" size={22} /> Geographic Location
            </h3>
            <div className="flex-1 relative rounded-2xl overflow-hidden border border-gray-200 shadow-inner min-h-[220px]">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
                alt="Map Location" 
                className="w-full h-full object-cover filter contrast-125"
              />
              <div className="absolute inset-0 bg-green-900/10 pointer-events-none"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="relative flex h-8 w-8 justify-center items-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600 border-2 border-white shadow-lg"></span>
                </span>
                <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-md mt-1 shadow-md">
                  {zoneName}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-700 text-xs tracking-wider">📍 {zoneLat.toFixed(4)}° N, {zoneLng.toFixed(4)}° E (Maharashtra)</span>
              {/* 🚀 FIXED: Passes lat and lng via navigate state */}
              <button 
                onClick={() => navigate('/map', { state: { lat: zoneLat, lng: zoneLng } })} 
                className="text-xs font-black text-[#114A29] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open in Live Map <MapIcon size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ZoneDetails;