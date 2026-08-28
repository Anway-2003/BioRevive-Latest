import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronLeft, MapPin, X, BookOpen, Shovel, Droplets, Sun, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchNativeSpecies } from '../services/geminiService'; 

const NativeSpecies = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showGuideModal, setShowGuideModal] = useState(false);

  // 🔥 AI States
  const [speciesList, setSpeciesList] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const categories = ['All', 'Trees', 'Shrubs', 'Grasses', 'Climbers', 'Ground Covers'];

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch('http://https://biorevive-backend-6yij.onrender.com/api/zones');
        if (response.ok) {
          const data = await response.json();
          setZones(data || []);
          if (data && data.length > 0) setSelectedZoneId(data[0].id);
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchZones();
  }, []);

  // 🔥 Status-Aware Fallback
  const getFallbackSpecies = (status) => {
    if (status === 'Critical' || status === 'High') {
      return [
        { id: 1, name: 'Neem', scientificName: 'Azadirachta indica', benefit: 'Survives in toxic soil', category: 'Trees', searchKeyword: 'neem' },
        { id: 2, name: 'Vetiver Grass', scientificName: 'Chrysopogon zizanioides', benefit: 'Cleans water runoff', category: 'Grasses', searchKeyword: 'grass' },
        { id: 3, name: 'Babul', scientificName: 'Vachellia nilotica', benefit: 'Drought Resistant', category: 'Trees', searchKeyword: 'babul' }
      ];
    }
    return [
      { id: 1, name: 'Mango Tree', scientificName: 'Mangifera indica', benefit: 'Optimal Growth', category: 'Trees', searchKeyword: 'mango' },
      { id: 2, name: 'Jasmine', scientificName: 'Jasminum', benefit: 'High Flowering', category: 'Shrubs', searchKeyword: 'jasmine' },
      { id: 3, name: 'Indian Banyan', scientificName: 'Ficus benghalensis', benefit: 'High Survival', category: 'Trees', searchKeyword: 'banyan' }
    ];
  };

  useEffect(() => {
    const getSpecies = async () => {
      const activeZone = zones.find(z => String(z.id) === String(selectedZoneId));
      if (!activeZone) return;

      setIsAiLoading(true);
      try {
        const data = await fetchNativeSpecies(activeZone.name, activeZone.status || 'Healthy');
        if (data && data.length > 0) {
          setSpeciesList(data.map((item, index) => ({ ...item, id: index + 1 })));
        } else throw new Error("Invalid");
      } catch (error) {
        console.warn("Gemini Failed, using fallback");
        setSpeciesList(getFallbackSpecies(activeZone.status));
      } finally {
        setIsAiLoading(false);
      }
    };

    if (selectedZoneId && zones.length > 0) getSpecies();
  }, [selectedZoneId, zones]);

  const filteredSpecies = activeCategory === 'All' ? speciesList : speciesList.filter(item => item.category === activeCategory);
  const activeZoneName = zones.find(z => String(z.id) === String(selectedZoneId))?.name || 'Selected Zone';

  return (
    <div className="w-full relative">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative flex flex-col">
        
        {/* Sticky Mobile Header */}
        <div className="sticky top-0 z-30 bg-white shadow-sm flex flex-col">
          <div className="px-4 py-4 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition cursor-pointer">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Native Species</h1>
              <p className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                For <span className="text-green-700">{activeZoneName}</span> 
                <Sparkles size={12} className={isAiLoading ? 'text-green-500 animate-pulse' : 'text-green-500'}/>
              </p>
            </div>
          </div>

          {/* Mobile Zone Selector */}
          <div className="px-4 pb-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex items-center">
              <MapPin size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <select 
                value={selectedZoneId}
                onChange={(e) => { setSelectedZoneId(e.target.value); setActiveCategory('All'); }}
                className="bg-transparent text-xs font-extrabold text-gray-800 outline-none w-full cursor-pointer truncate"
              >
                {loading ? <option>Loading...</option> : zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Horizontal Scroll Tabs */}
          <div className="px-4 py-3 border-t border-gray-100 flex overflow-x-auto gap-2 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  activeCategory === cat ? 'bg-[#114A29] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content Area */}
        <div className="p-4 space-y-4 flex-1">
          {isAiLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} className="text-[#114A29] animate-spin mb-3" />
              <p className="text-xs text-gray-500 font-bold animate-pulse">Finding native flora...</p>
            </div>
          ) : filteredSpecies.length > 0 ? (
            filteredSpecies.map((species, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="relative h-40 bg-gray-200 w-full">
                  <img src={`https://loremflickr.com/400/300/${species.searchKeyword || 'plant'},nature/all?lock=${idx}`} alt={species.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg text-[10px] font-bold">
                    🌱 {species.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">{species.name}</h3>
                  <p className="text-xs font-medium text-gray-400 italic mb-3">{species.scientificName}</p>
                  <div className="flex items-center gap-1.5 pt-3 border-t border-gray-50">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span className="text-xs font-bold text-green-700">{species.benefit}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100 text-sm">
              No recommendations found.
            </div>
          )}

          {/* Mobile Planting Guide Banner */}
          {!isAiLoading && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-6 flex flex-col">
              <h4 className="font-extrabold text-gray-800 text-sm mb-1">Ready to plant in {activeZoneName}?</h4>
              <p className="text-[11px] font-medium text-gray-500 mb-4">Access step-by-step soil preparation and planting guidelines.</p>
              <button onClick={() => setShowGuideModal(true)} className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition active:scale-95">
                View Planting Guide <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Native Species Recommendations</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
              AI-selected flora tailored for <strong className="text-green-700">{activeZoneName}</strong> <Sparkles size={14} className={isAiLoading ? 'text-green-600 animate-pulse' : 'text-green-600'} />
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <select 
                value={selectedZoneId}
                onChange={(e) => { setSelectedZoneId(e.target.value); setActiveCategory('All'); }}
                className="bg-transparent text-sm font-extrabold text-gray-800 outline-none cursor-pointer w-40"
              >
                {loading ? <option>Loading...</option> : zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
            <Link to="/revival-plan" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition bg-gray-100 px-4 py-2.5 rounded-xl">
              Back to Plan
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${activeCategory === cat ? 'bg-[#114A29] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        {isAiLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-[#114A29] animate-spin mb-4" />
            <p className="text-gray-500 font-bold animate-pulse">Gemini is finding native flora...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {filteredSpecies.length > 0 ? (
              filteredSpecies.map((species, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition">
                  <div>
                    <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-gray-200">
                      <img src={`https://loremflickr.com/400/300/${species.searchKeyword || 'plant'},nature/all?lock=${idx}`} alt={species.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-lg text-xs font-bold">🌱 {species.category}</span>
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-lg mb-1">{species.name}</h3>
                    <p className="text-xs font-medium text-gray-400 italic mb-3">{species.scientificName}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span className="text-xs font-bold text-green-700">{species.benefit}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">
                No recommendations found for this category.
              </div>
            )}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-gray-800 text-base">Ready to start planting in {activeZoneName}?</h4>
            <p className="text-xs font-medium text-gray-500">Access step-by-step soil preparation and planting guidelines.</p>
          </div>
          <button onClick={() => setShowGuideModal(true)} className="bg-[#114A29] hover:bg-green-900 text-white font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm">
            View Planting Guide <ArrowRight size={18} />
          </button>
        </div>
      </div>
      
      {/* 🚀 GUIDE MODAL (Both Mobile & Desktop) */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] md:max-h-[80vh]">
            <div className="bg-[#114A29] text-white p-5 md:p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 md:p-2.5 rounded-xl"><BookOpen size={20} className="text-green-300 md:w-6 md:h-6" /></div>
                <div>
                  <h2 className="text-lg md:text-xl font-extrabold">Planting & Soil Guide</h2>
                  <p className="text-[10px] md:text-xs text-green-200 font-medium mt-0.5">Zone: {activeZoneName}</p>
                </div>
              </div>
              <button onClick={() => setShowGuideModal(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition text-white cursor-pointer"><X size={20} /></button>
            </div>
            <div className="p-5 md:p-6 overflow-y-auto space-y-4 md:space-y-6 flex-1">
              <div className="flex gap-3 md:gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="bg-green-100 text-[#114A29] p-2.5 md:p-3 rounded-xl flex-shrink-0"><Shovel size={20} className="md:w-5 md:h-5"/></div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">Step 1: Soil Testing & Digging</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">Test pH levels (ideal range 6.0 - 7.5). Dig a pit of 2x2 feet for saplings and loosen the soil at the base to allow root penetration.</p>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="bg-blue-100 text-blue-700 p-2.5 md:p-3 rounded-xl flex-shrink-0"><Droplets size={20} className="md:w-5 md:h-5"/></div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">Step 2: Organic Compost Enrichment</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">Mix 5kg of vermicompost and organic manure with the excavated soil to boost microbial activity.</p>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="bg-amber-100 text-amber-700 p-2.5 md:p-3 rounded-xl flex-shrink-0"><Sun size={20} className="md:w-5 md:h-5"/></div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">Step 3: Sapling Plantation & Mulching</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">Place the native sapling upright, press soil firmly around the roots, and apply heavy mulch around the base.</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowGuideModal(false)} className="w-full md:w-auto bg-[#114A29] hover:bg-green-900 text-white font-bold px-6 py-3 md:py-2.5 rounded-xl transition text-sm cursor-pointer shadow-sm">
                Got It, Let's Plant!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NativeSpecies;