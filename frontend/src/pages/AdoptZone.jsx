import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, ChevronLeft } from 'lucide-react';

const AdoptZone = () => {
  const navigate = useNavigate();
  const [adoptType, setAdoptType] = useState('Individual');

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW (Fkt mobile var disel - block md:hidden) */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans relative flex flex-col pb-24">
        
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Adopt Zone</h1>
            <p className="text-[11px] font-bold text-gray-500">Make a commitment</p>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 flex-1 flex flex-col">
          
          {/* Zone Info Card */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-5 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-gray-800 text-base">Kharadi Industrial Area</h2>
              <p className="text-xs font-bold text-gray-500 mt-1">12.4 ha • <span className="text-red-500">Critical</span></p>
            </div>
            <div className="bg-green-100 p-2.5 rounded-xl text-green-800">
              <HeartHandshake size={20} />
            </div>
          </div>

          {/* Illustration Container */}
          <div className="bg-gradient-to-b from-green-50 to-transparent p-6 rounded-2xl mb-6 text-center border border-green-100/50">
            <div className="text-5xl mb-3">🌿🧑‍🌾🌱</div>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Make a real impact by adopting this zone and helping restore biodiversity.
            </p>
          </div>

          {/* Adoption Type Selection */}
          <div className="mb-8 flex-1">
            <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-3 px-1">
              You can adopt as:
            </label>
            <div className="flex flex-col gap-3">
              {['Individual', 'Group', 'Organization'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAdoptType(type)}
                  className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all border text-left ${
                    adoptType === type
                      ? 'bg-[#114A29] text-white border-[#114A29] shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Proceed Button */}
          <button className="w-full bg-[#114A29] hover:bg-green-800 text-white font-extrabold py-4 rounded-xl transition shadow-lg active:scale-95">
            Proceed to Adopt
          </button>

        </div>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW (Tuza Juna Code - hidden md:flex) */}
      <div className="hidden md:flex p-8 bg-[#F8FAFC] min-h-screen font-sans w-full items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl w-full">
          
          {/* Top Navigation / Back */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Adopt This Zone</h1>
              <p className="text-xs font-bold text-gray-400 mt-0.5">Make a commitment to ecosystem revival</p>
            </div>
            <Link to="/zone/1" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-1">
              <ArrowLeft size={16} /> Back
            </Link>
          </div>

          {/* Zone Info Header */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-gray-800 text-lg">Kharadi Industrial Area</h2>
              <p className="text-xs font-bold text-gray-500 mt-0.5">12.4 ha • <span className="text-red-500">Critical</span></p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl text-green-800">
              <HeartHandshake size={24} />
            </div>
          </div>

          {/* Illustration Container */}
          <div className="bg-gradient-to-b from-green-50/50 to-transparent p-6 rounded-2xl mb-6 text-center relative overflow-hidden border border-green-50">
            <div className="text-5xl mb-2">🌿🧑‍🌾🌱</div>
            <p className="text-sm font-medium text-gray-600 max-w-md mx-auto leading-relaxed">
              Make a real impact by adopting this zone and helping restore biodiversity.
            </p>
          </div>

          {/* Adoption Type Selection */}
          <div className="mb-8">
            <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-3">
              You can adopt as:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Individual', 'Group', 'Organization'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAdoptType(type)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                    adoptType === type
                      ? 'bg-[#114A29] text-white border-[#114A29] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Proceed Button */}
          <button className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md">
            Proceed to Adopt
          </button>

        </div>
      </div>
      
    </div>
  );
};

export default AdoptZone;