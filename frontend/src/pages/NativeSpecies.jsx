import  { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NativeSpecies = () => {
  const navigate = useNavigate();
  // Aapan 'All' category pan add keli ahe mobile layout la match karnyasti
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Trees', 'Shrubs', 'Grasses', 'Climbers', 'Ground Covers'];

  const speciesList = [
    {
      id: 1,
      name: 'Neem',
      botanical: 'Azadirachta indica',
      survival: 'High Survival',
      category: 'Trees',
      img: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      name: 'Indian Laburnum',
      botanical: 'Cassia fistula',
      survival: 'Medium Survival',
      category: 'Trees',
      img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      name: 'Indian Banyan',
      botanical: 'Ficus benghalensis',
      survival: 'High Survival',
      category: 'Trees',
      img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      name: 'Vetiver Grass',
      botanical: 'Chrysopogon zizanioides',
      survival: 'High Survival',
      category: 'Grasses',
      img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const filteredSpecies = activeCategory === 'All' 
    ? speciesList 
    : speciesList.filter(item => item.category === activeCategory);

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW (Fkt mobile var disel - block md:hidden) */}
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

        {/* Scrollable Horizontal Tabs */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-100 flex overflow-x-auto gap-2 sticky top-[68px] z-10 custom-scrollbar">
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
          <button className="w-full bg-[#114A29] text-white py-3.5 rounded-xl font-extrabold shadow-lg hover:bg-green-800 transition active:scale-95 flex items-center justify-center gap-2">
            View Planting Guide
          </button>
        </div>
      </div>

      
      {/* 💻 2. DESKTOP / WEB VIEW (Tuza Juna Code - hidden md:block) */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Native Species Recommendations</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
              AI-selected flora tailored for optimal ecosystem revival <Sparkles size={14} className="text-green-600" />
            </p>
          </div>
          <Link to="/revival-plan" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition">
            Back to Plan
          </Link>
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
                    <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-lg">
                      🌱
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
              No specific recommendations loaded for this category yet. Showing default optimal flora.
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-gray-800 text-base">Ready to start planting?</h4>
            <p className="text-xs font-medium text-gray-500">Access step-by-step soil preparation and planting guidelines.</p>
          </div>
          <button className="bg-[#114A29] hover:bg-green-900 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-md flex items-center gap-2">
            View Planting Guide <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default NativeSpecies;