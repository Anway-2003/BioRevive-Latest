import 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  Sparkles 
} from 'lucide-react';

const ZoneDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW (Fkt mobile var disel - block md:hidden) */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
        
        {/* Mobile Header with Image */}
        <div className="relative h-72 w-full">
          {/* 👇 FIxed Image Link Here */}
          <img 
            src="https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&w=1200&q=80" 
            alt="Zone" 
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <button onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur-md text-white p-2 rounded-xl hover:bg-white/30 transition">
              <ChevronLeft size={24} />
            </button>
            <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1">
              <AlertTriangle size={12} /> CRITICAL ZONE
            </span>
          </div>

          {/* Title Area */}
          <div className="absolute bottom-8 left-4 right-4 text-white z-10">
            <h1 className="text-2xl font-extrabold leading-tight mb-1">Kharadi Industrial Area</h1>
            <p className="text-xs font-medium text-gray-300 flex items-center gap-1">
              <MapPin size={12} className="text-green-400" /> Pune, Maharashtra • 12.4 ha
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-4 py-5 space-y-5 -mt-5 relative z-20 bg-[#F8FAFC] rounded-t-3xl">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Activity size={18} className="mx-auto text-red-500 mb-1" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">Health Score</p>
              <p className="text-sm font-black text-gray-900">12%</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Sprout size={18} className="mx-auto text-[#114A29] mb-1" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">Flora Lost</p>
              <p className="text-sm font-black text-gray-900">85%</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <ShieldAlert size={18} className="mx-auto text-orange-500 mb-1" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
              <p className="text-sm font-black text-gray-900">Unadopted</p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3">
            <button onClick={() => navigate('/analysis')} className="w-full bg-[#114A29] text-white py-4 rounded-xl font-extrabold shadow-md hover:bg-green-800 transition active:scale-95 flex items-center justify-between px-5">
              <span className="flex items-center gap-2"><Sparkles size={18} /> View AI Analysis</span>
              <ArrowRight size={18} />
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/adopt-zone')} className="bg-white border border-[#114A29] text-[#114A29] py-3 rounded-xl font-extrabold shadow-sm flex flex-col items-center justify-center gap-1">
                <Sprout size={20} />
                <span className="text-xs">Adopt Zone</span>
              </button>
              <button onClick={() => navigate('/upload')} className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-extrabold shadow-sm flex flex-col items-center justify-center gap-1">
                <Camera size={20} />
                <span className="text-xs">Update Photos</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW (Tuza Old Code - hidden md:block) */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Navigation / Breadcrumb for Web */}
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-500">
          <button onClick={() => navigate('/map')} className="hover:text-[#114A29] transition flex items-center gap-1">
            <ChevronLeft size={16} /> Back to Map
          </button>
        </div>

        {/* 1. Header Section */}
        <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Kharadi Industrial Area</h1>
            <p className="text-gray-500 font-medium text-sm">Pune, Maharashtra</p>
          </div>
          <div className="bg-[#E74C3C] text-white px-5 py-2 rounded-xl font-bold shadow-sm flex items-center gap-2">
            Critical
          </div>
        </div>

        {/* 2. Top Content: Image Slider + Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left: Image Slider (Spans 2 columns) */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
            {/* 👇 Fixed Image Link Here Too */}
            <img 
              src="https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&w=1200&q=80" 
              alt="Dead Zone Overview" 
              className="w-full h-[320px] object-cover"
            />
            
            {/* Image Controls (Arrows & Expand) */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
              <ChevronLeft size={20} />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
              <ChevronRight size={20} />
            </button>
            <button className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg backdrop-blur-sm transition">
              <Maximize2 size={18} />
            </button>
          </div>

          {/* Right: Key Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-500 mb-2">Severity Score</p>
              <h2 className="text-3xl font-extrabold text-gray-900">92%</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-500 mb-2">Biodiversity Score</p>
              <h2 className="text-3xl font-extrabold text-gray-900">18<span className="text-lg text-gray-400">/100</span></h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-500 mb-2">Area</p>
              <h2 className="text-3xl font-extrabold text-gray-900">12.4 ha</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-500 mb-2">Status</p>
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-gray-400" />
                <h2 className="text-lg font-extrabold text-gray-700">Unadopted</h2>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons Container for Web (Added to link pages) */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => navigate('/analysis')} className="flex-1 bg-[#114A29] text-white py-3 rounded-xl font-bold shadow-sm hover:bg-green-900 transition flex justify-center items-center gap-2">
            <Sparkles size={18} /> View AI Analysis
          </button>
          <button onClick={() => navigate('/adopt-zone')} className="flex-1 bg-green-50 text-[#114A29] border border-green-200 py-3 rounded-xl font-bold shadow-sm hover:bg-green-100 transition flex justify-center items-center gap-2">
            <Sprout size={18} /> Adopt This Zone
          </button>
          <button onClick={() => navigate('/upload')} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition flex justify-center items-center gap-2">
            <Camera size={18} /> Update Photos
          </button>
        </div>

        {/* 3. Bottom Content: Causes + Location Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Main Causes */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-900 mb-6">Main Causes</h3>
            <div className="space-y-6">
              
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-green-50 transition">
                    <Factory size={20} className="text-gray-600 group-hover:text-green-700" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Industrial Waste</span>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">High Impact</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-green-50 transition">
                    <TestTubes size={20} className="text-gray-600 group-hover:text-green-700" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Soil Pollution</span>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">High Impact</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-green-50 transition">
                    <TreePine size={20} className="text-gray-600 group-hover:text-green-700" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Vegetation Loss</span>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">High Impact</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-green-50 transition">
                    <Droplets size={20} className="text-gray-600 group-hover:text-green-700" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Water Contamination</span>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">High Impact</span>
              </div>

            </div>
          </div>

          {/* Right: Location Map */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-extrabold text-gray-900 mb-6">Location</h3>
            <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200">
              {/* Static Map Image Placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" 
                alt="Map Location" 
                className="w-full h-48 object-cover opacity-80"
              />
              {/* Fake Map Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-white shadow-sm"></span>
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="font-bold text-gray-600 text-sm tracking-wide">18.5547° N, 73.9401° E</span>
              <button className="text-gray-400 hover:text-green-700 transition">
                <MapIcon size={18} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ZoneDetails;