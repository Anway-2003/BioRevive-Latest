import 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, TestTubes, Droplets, ShieldAlert, Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';

const AIAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW (Fkt mobile var disel - block md:hidden) */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24">
        
        {/* Mobile App Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900">AI Analysis</h1>
        </div>

        <div className="p-5 space-y-5">
          {/* Powered by AI Tag */}
          <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            Powered by <span className="text-purple-600 font-extrabold flex items-center gap-1">Claude AI <Sparkles size={12} /></span>
          </p>

          {/* AI Metrics List Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 divide-y divide-gray-100">
            
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Severity Score</span>
              <span className="text-sm font-black text-red-500">92%</span>
            </div>
            
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Revival Potential</span>
              <span className="text-sm font-black text-green-600">High (75%)</span>
            </div>
            
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Deforestation</span>
              <span className="text-sm font-black text-red-500">High</span>
            </div>
            
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Chemical Runoff</span>
              <span className="text-sm font-black text-red-500">High</span>
            </div>
            
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Restoration Time</span>
              <span className="text-sm font-black text-gray-900">18-24 Months</span>
            </div>

          </div>

          {/* AI Summary Box */}
          <div className="bg-green-50/50 rounded-2xl shadow-sm border border-green-100 p-5">
            <h3 className="text-sm font-extrabold text-gray-900 mb-2">AI Summary</h3>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              This zone has high revival potential with native species restoration and soil remediation.
            </p>
          </div>

          {/* Bottom Action Button */}
          <button 
            onClick={() => navigate('/revival-plan')}
            className="w-full bg-[#114A29] text-white py-3.5 rounded-xl font-extrabold shadow-md hover:bg-green-800 transition active:scale-95"
          >
            View Revival Plan
          </button>
        </div>
      </div>

      
      {/* 💻 2. DESKTOP / WEB VIEW (Tuza Juna Code - Fkt laptop var disel - hidden md:block) */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">AI Analysis Report</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
              Powered by <span className="text-purple-600 font-bold">Claude AI</span> <Sparkles size={14} className="text-purple-500" />
            </p>
          </div>
          <Link to="/map" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition">
            Back to Map
          </Link>
        </div>

        {/* Top Grid: Gauge & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Severity Score Gauge Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <h3 className="w-full text-left font-bold text-gray-800 text-lg mb-4">Severity Score</h3>
            <div className="relative w-48 h-28 overflow-hidden flex items-end justify-center">
              {/* Semi-circle Gauge SVG */}
              <svg className="w-full h-full" viewBox="0 0 100 55">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="10" strokeLinecap="round" />
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gaugeGradient)" strokeWidth="10" strokeLinecap="round" strokeDasharray="126" strokeDashoffset="10" />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="50%" stopColor="#EAB308" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 text-3xl font-extrabold text-gray-900">
                92%
              </div>
            </div>
            <p className="text-xs font-bold text-red-500 mt-2 uppercase tracking-wide">Critical Level</p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Revival Potential</p>
              <h4 className="text-2xl font-extrabold text-green-600 mb-1">High</h4>
              <p className="text-xs font-bold text-gray-500">(75% success rate)</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Restoration Time</p>
              <h4 className="text-2xl font-extrabold text-gray-800 mb-1">18-24 Months</h4>
              <p className="text-xs font-bold text-gray-500">Estimated duration</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Confidence</p>
              <h4 className="text-2xl font-extrabold text-gray-800 mb-1">89%</h4>
              <p className="text-xs font-bold text-gray-500">Model accuracy</p>
            </div>

          </div>

        </div>

        {/* Bottom Section: Primary Causes & AI Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Primary Causes */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-900 mb-6">Primary Causes</h3>
            <div className="space-y-6">
              
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-red-50 transition">
                    <ShieldAlert size={20} className="text-gray-600 group-hover:text-red-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Deforestation</span>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">High</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-red-50 transition">
                    <TestTubes size={20} className="text-gray-600 group-hover:text-red-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Chemical Runoff</span>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">High</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-red-50 transition">
                    <TreePine size={20} className="text-gray-600 group-hover:text-red-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Soil Pollution</span>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">High</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-yellow-50 transition">
                    <Droplets size={20} className="text-gray-600 group-hover:text-yellow-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Water Contamination</span>
                </div>
                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">Moderate</span>
              </div>

            </div>
          </div>

          {/* AI Summary & Action */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-4">AI Summary</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                This zone has very high revival potential with native species restoration, soil remediation, and community participation.
              </p>
            </div>
            
            <Link 
              to="/revival-plan" 
              className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-center"
            >
              View Revival Plan <ArrowRight size={18} />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AIAnalysis;