import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronLeft, MapPin, X, BookOpen, Shovel, Droplets, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NativeSpecies = () => {
  const navigate = useNavigate();
  
  // 1. States for Live Zones & Categories
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // 🚀 Planting Guide Modal State
  const [showGuideModal, setShowGuideModal] = useState(false);

  const categories = ['All', 'Trees', 'Shrubs', 'Grasses', 'Climbers', 'Ground Covers'];

  // 🚀 2. Fetch Live Zones from Java Backend
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/zones');
        if (response.ok) {
          const data = await response.json();
          setZones(data || []);
          if (data && data.length > 0) {
            setSelectedZoneId(data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching zones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  // 🚀 3. Safe Dynamic Species List based on Selected Zone Status
  const getDynamicSpecies = () => {
    const activeZone = zones.find(z => String(z.id) === String(selectedZoneId));
    const status = activeZone ? activeZone.status : 'Healthy';

    if (status === 'Critical') {
      return [
        { id: 1, name: 'Neem', botanical: 'Azadirachta indica', survival: 'High Survival', category: 'Trees', img: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Vetiver Grass', botanical: 'Chrysopogon zizanioides', survival: 'Extreme Survival', category: 'Grasses', img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Calotropis (Rui)', botanical: 'Calotropis gigantea', survival: 'Drought Resistant', category: 'Shrubs', img: 'https://images.unsplash.com/photo-1611077543881-3701a2d5cf72?auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'Babul', botanical: 'Vachellia nilotica', survival: 'High Survival', category: 'Trees', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' }
      ];
    } else if (status === 'High') {
      return [
        { id: 1, name: 'Indian Banyan', botanical: 'Ficus benghalensis', survival: 'High Survival', category: 'Trees', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Indian Laburnum', botanical: 'Cassia fistula', survival: 'Medium Survival', category: 'Trees', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Aloe Vera', botanical: 'Aloe barbadensis miller', survival: 'High Survival', category: 'Shrubs', img: 'https://images.unsplash.com/photo-1559182567-94ec13028c0d?auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'Lemongrass', botanical: 'Cymbopogon', survival: 'Good Soil Binder', category: 'Grasses', img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80' }
      ];
    } else {
      return [
        { id: 1, name: 'Mango Tree', botanical: 'Mangifera indica', survival: 'Optimal Growth', category: 'Trees', img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Jasmine', botanical: 'Jasminum', survival: 'High Flowering', category: 'Shrubs', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Indian Banyan', botanical: 'Ficus benghalensis', survival: 'High Survival', category: 'Trees', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'Vetiver Grass', botanical: 'Chrysopogon zizanioides', survival: 'High Survival', category: 'Grasses', img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80' }
      ];
    }
  };

  const speciesList = getDynamicSpecies();
  const filteredSpecies = activeCategory === 'All' 
    ? speciesList 
    : speciesList.filter(item => item.category === activeCategory);

  const activeZoneName = zones.find(z => String(z.id) === String(selectedZoneId))?.name || 'Selected Zone';

  return (
    <div className="w-full relative">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative flex flex-col">
        
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Native Species</h1>
            <p className="text-[11px] font-bold text-gray-500">Recommended Flora</p>
          </div>
        </div>

        {/* Mobile Zone Selector */}
        <div className="px-4 pt-3 bg-white border-b border-gray-100">
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex items-center mb-3">
            <MapPin size={16} className="text-gray-400 mr-2" />
            <select 
              value={selectedZoneId}
              onChange={(e) => {
                setSelectedZoneId(e.target.value);
                setActiveCategory('All');
              }}
              className="bg-transparent text-xs font-extrabold text-gray-800 outline-none w-full"
            >
              {loading ? <option>Loading...</option> : zones.map(z => (
                <option key={z.id} value={z.id}>{z.name} ({z.status})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Horizontal Tabs */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-100 flex overflow-x-auto gap-2 sticky top-[120px] z-10 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#114A29] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vertical List View */}
        <div className="p-4 space-y-4 flex-1">
          {filteredSpecies.length > 0 ? (
            filteredSpecies.map((species) => (
              <div key={species.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={species.img} alt={species.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-gray-900 text-base">{species.name}</h3>
                  <p className="text-xs font-medium text-gray-500 italic mb-2">{species.botanical}</p>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span className="text-xs font-bold text-green-700">{species.survival}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100 text-sm">
              No recommendations found for this category.
            </div>
          )}
        </div>

        {/* Bottom Action Button */}
        <div className="px-4 mt-2">
          <button 
            onClick={() => setShowGuideModal(true)}
            className="w-full bg-[#114A29] text-white py-3.5 rounded-xl font-extrabold shadow-lg hover:bg-green-800 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            View Planting Guide
          </button>
        </div>
      </div>

      
      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Native Species Recommendations</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
              AI-selected flora tailored for <strong className="text-green-700">{activeZoneName}</strong> <Sparkles size={14} className="text-green-600" />
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <select 
                value={selectedZoneId}
                onChange={(e) => {
                  setSelectedZoneId(e.target.value);
                  setActiveCategory('All');
                }}
                className="bg-transparent text-sm font-extrabold text-gray-800 outline-none cursor-pointer w-40"
              >
                {loading ? <option>Loading...</option> : zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            <Link to="/revival-plan" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition bg-gray-100 px-4 py-2.5 rounded-xl">
              Back to Plan
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                activeCategory === cat
                  ? 'bg-[#114A29] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Species Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {filteredSpecies.length > 0 ? (
            filteredSpecies.map((species) => (
              <div key={species.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition">
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                    <img src={species.img} alt={species.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-lg text-xs font-bold">
                      🌱 {species.category}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg mb-1">{species.name}</h3>
                  <p className="text-xs font-medium text-gray-400 italic mb-3">{species.botanical}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span className="text-xs font-bold text-green-700">{species.survival}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">
              No recommendations found for this category in {activeZoneName}.
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-gray-800 text-base">Ready to start planting in {activeZoneName}?</h4>
            <p className="text-xs font-medium text-gray-500">Access step-by-step soil preparation and planting guidelines.</p>
          </div>
          <button 
            onClick={() => setShowGuideModal(true)}
            className="bg-[#114A29] hover:bg-green-900 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            View Planting Guide <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* 🚀 PLANTING GUIDE POPUP MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#114A29] text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <BookOpen size={24} className="text-green-300" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">Planting & Soil Guide</h2>
                  <p className="text-xs text-green-200 font-medium">Zone: {activeZoneName}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowGuideModal(false)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Step 1 */}
              <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="bg-green-100 text-[#114A29] p-3 rounded-xl flex-shrink-0">
                  <Shovel size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">Step 1: Soil Testing & Digging</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Test pH levels (ideal range 6.0 - 7.5). Dig a pit of 2x2 feet for saplings and loosen the soil at the base to allow root penetration.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="bg-blue-100 text-blue-700 p-3 rounded-xl flex-shrink-0">
                  <Droplets size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">Step 2: Organic Compost Enrichment</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Mix 5kg of vermicompost and organic manure with the excavated soil to boost microbial activity and improve moisture retention.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="bg-amber-100 text-amber-700 p-3 rounded-xl flex-shrink-0">
                  <Sun size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-1">Step 3: Sapling Plantation & Mulching</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Place the native sapling upright, press soil firmly around the roots, and apply heavy mulch around the base to prevent weed growth and evaporation.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowGuideModal(false)}
                className="bg-[#114A29] hover:bg-green-900 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm cursor-pointer shadow-sm"
              >
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