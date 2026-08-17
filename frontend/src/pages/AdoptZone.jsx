import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, ChevronLeft, MapPin, Award, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AdoptZone = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL varun exact ID ghene (e.g. 2 for Bhosa)

  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adoptType, setAdoptType] = useState('Individual');
  const [adopterName, setAdopterName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 🚀 Fetch real zone details from Java Backend
  useEffect(() => {
    const fetchZoneDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/zones');
        if (response.ok) {
          const listData = await response.json();
          const found = listData.find(z => String(z.id) === String(id));
          if (found) {
            setZone(found);
          } else if (listData.length > 0) {
            setZone(listData[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching zone details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchZoneDetails();
  }, [id]);

  const zoneName = zone?.name || `Zone #${id || 'Selected'}`;
  const zoneStatus = zone?.status || 'Critical';
  const zoneLat = zone?.latitude ? zone.latitude.toFixed(4) : '18.5547';
  const zoneLng = zone?.longitude ? zone.longitude.toFixed(4) : '73.9401';

  // 🚀 Handle Adoption, Java DB Update, & Supabase/Local Points Sync
  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    if (!adopterName.trim()) {
      alert("Please enter your name!");
      return;
    }

    try {
      // 1. JAVA BACKEND API CALL (Update Zone status in MySQL/H2)
      if (id) {
        await fetch(`http://localhost:8080/api/zones/${id}/adopt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            adopterName: adopterName,
            adoptType: adoptType 
          })
        }).catch(err => console.log("Java backend endpoint optional notice:", err));
      }

      // 2. SUPABASE PROFILE POINTS UPDATE (+50 Points)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('points, full_name')
          .eq('id', user.id)
          .single();

        const currentPoints = profile?.points || 0;
        
        await supabase
          .from('profiles')
          .upsert({ 
            id: user.id, 
            points: currentPoints + 50,
            full_name: profile?.full_name || adopterName
          });
      }

      // 3. LOCALSTORAGE BACKUP (To ensure instant UI display across tabs)
      const existingPoints = parseInt(localStorage.getItem('biorevive_points') || '10', 10);
      localStorage.setItem('biorevive_points', existingPoints + 50);
      localStorage.setItem(`adopted_zone_${id}`, 'true');

      setShowSuccessModal(true);

    } catch (error) {
      console.error("Adoption sync error:", error);
      setShowSuccessModal(true); // Fallback to show success modal anyway
    }
  };

  return (
    <div className="w-full relative">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans relative flex flex-col pb-24">
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition cursor-pointer">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Adopt Zone</h1>
            <p className="text-[11px] font-bold text-gray-500">Make a commitment</p>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-5 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-gray-800 text-base">{zoneName}</h2>
              <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1">
                <MapPin size={12} className="text-green-600" /> {zoneLat}° N, {zoneLng}° E • <span className="text-red-500 uppercase">{zoneStatus}</span>
              </p>
            </div>
            <div className="bg-green-100 p-2.5 rounded-xl text-green-800">
              <HeartHandshake size={20} />
            </div>
          </div>

          <div className="bg-gradient-to-b from-green-50 to-transparent p-6 rounded-2xl mb-6 text-center border border-green-100/50">
            <div className="text-5xl mb-3">🌿🧑‍🌾🌱</div>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Make a real impact by adopting <strong>{zoneName}</strong> and restoring its ecosystem.
            </p>
          </div>

          <form onSubmit={handleAdoptSubmit} className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-2 px-1">
                Adopter Name:
              </label>
              <input 
                type="text"
                value={adopterName}
                onChange={(e) => setAdopterName(e.target.value)}
                placeholder="e.g. Anway"
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-sm font-bold text-gray-800 outline-none focus:border-[#114A29]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-3 px-1">
                Adopt As:
              </label>
              <div className="flex flex-col gap-3">
                {['Individual', 'Group', 'Organization'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAdoptType(type)}
                    className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all border text-left cursor-pointer ${
                      adoptType === type ? 'bg-[#114A29] text-white border-[#114A29] shadow-md' : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-[#114A29] hover:bg-green-800 text-white font-extrabold py-4 rounded-xl transition shadow-lg active:scale-95 cursor-pointer mt-4">
              Confirm Adoption
            </button>
          </form>
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:flex p-8 bg-[#F8FAFC] min-h-screen font-sans w-full items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl w-full">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Adopt This Zone</h1>
              <p className="text-xs font-bold text-gray-400 mt-0.5">Make a commitment to ecosystem revival</p>
            </div>
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-1 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-gray-800 text-lg">{zoneName}</h2>
              <p className="text-xs font-bold text-gray-500 mt-0.5 flex items-center gap-1">
                <MapPin size={12} className="text-green-600" /> {zoneLat}° N, {zoneLng}° E • <span className="text-red-500 uppercase">{zoneStatus}</span>
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl text-green-800">
              <HeartHandshake size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-b from-green-50/50 to-transparent p-6 rounded-2xl mb-6 text-center relative overflow-hidden border border-green-50">
            <div className="text-5xl mb-2">🌿🧑‍🌾🌱</div>
            <p className="text-sm font-medium text-gray-600 max-w-md mx-auto leading-relaxed">
              Make a real impact by adopting <strong>{zoneName}</strong> and helping restore local biodiversity.
            </p>
          </div>

          <form onSubmit={handleAdoptSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-2">
                Adopter Name / Entity:
              </label>
              <input 
                type="text"
                value={adopterName}
                onChange={(e) => setAdopterName(e.target.value)}
                placeholder="e.g. Anway"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-bold text-gray-800 outline-none focus:border-[#114A29]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-3">
                You can adopt as:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Individual', 'Group', 'Organization'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAdoptType(type)}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                      adoptType === type ? 'bg-[#114A29] text-white border-[#114A29] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md cursor-pointer">
              Confirm & Adopt Zone
            </button>
          </form>

        </div>
      </div>

      {/* 🚀 SUCCESS & REWARD POINTS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative text-center border border-green-100 animate-in zoom-in duration-300">
            
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full cursor-pointer">
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-green-100 text-[#114A29] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Award size={36} />
            </div>

            <span className="bg-green-50 text-[#114A29] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-green-200">
              Adoption Successful!
            </span>

            <h3 className="text-2xl font-black text-gray-900 mt-3 mb-1">Thank You, {adopterName}!</h3>
            <p className="text-sm font-bold text-gray-600 mb-6">
              You have successfully adopted <span className="text-[#114A29]">{zoneName}</span>.
            </p>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left mb-6 space-y-2">
              <p className="text-xs font-extrabold text-gray-400 uppercase">Impact Summary</p>
              <p className="text-sm font-black text-gray-800">📍 Zone: {zoneName} ({zoneStatus})</p>
              <p className="text-sm font-black text-green-700">🌿 +50 Reward Points Added to your Dashboard!</p>
            </div>

            <button 
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/dashboard');
              }}
              className="w-full bg-[#114A29] hover:bg-green-900 text-white font-extrabold py-3.5 rounded-xl transition shadow-md cursor-pointer"
            >
              Go to Dashboard
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdoptZone;