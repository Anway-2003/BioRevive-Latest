import 'react';
import { Download, Share2, FileText, ChevronDown, Settings } from 'lucide-react';

const ImpactTracker = () => {
  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW (Fkt mobile var disel - block md:hidden) */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
        
        {/* Mobile Header (Acts as Profile Top) */}
        <div className="bg-white px-4 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 leading-tight">My Impact</h1>
              <p className="text-[11px] font-bold text-gray-500">Anway • Eco Warrior</p>
            </div>
          </div>
          <button className="text-gray-500 hover:bg-gray-50 p-2 rounded-full transition">
            <Settings size={20} />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-5">
          
          {/* Filter Bar */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-gray-800">Impact Overview</h2>
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 text-[11px] font-bold text-gray-600">
              This Year <ChevronDown size={14} />
            </div>
          </div>

          {/* 2x2 Stats Grid for Mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">127</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Trees Planted</p>
              <p className="text-[10px] font-bold text-green-600 mt-2 bg-green-50 inline-block px-1.5 py-0.5 rounded">↑ 33 this mo</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">42</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Species Added</p>
              <p className="text-[10px] font-bold text-green-600 mt-2 bg-green-50 inline-block px-1.5 py-0.5 rounded">↑ 7 this mo</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">18.6<span className="text-sm text-gray-500">ha</span></p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Area Restored</p>
              <p className="text-[10px] font-bold text-green-600 mt-2 bg-green-50 inline-block px-1.5 py-0.5 rounded">↑ 3.2ha</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">2.4<span className="text-sm text-gray-500">K</span></p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">CO₂ Saved (kg)</p>
              <p className="text-[10px] font-bold text-green-600 mt-2 bg-green-50 inline-block px-1.5 py-0.5 rounded">↑ 300kg</p>
            </div>
          </div>

          {/* Compact Chart Section */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-gray-800 text-sm mb-4">Impact Over Time</h3>
            <div className="h-40 w-full relative">
              <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-bold pb-6">
                <span>150</span><span>75</span><span>0</span>
              </div>
              <div className="ml-6 h-full relative">
                <div className="absolute inset-0 flex flex-col justify-between pb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full border-b border-gray-100"></div>
                  ))}
                </div>
                <svg className="absolute inset-0 h-[calc(100%-1.5rem)] w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0,80 Q 20,65 40,50 T 60,40 T 80,30 T 100,15" fill="none" stroke="#16A34A" strokeWidth="2" />
                  <path d="M 0,90 Q 20,75 40,65 T 60,60 T 80,45 T 100,35" fill="none" stroke="#3B82F6" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-0 w-full flex justify-between text-[9px] text-gray-400 font-bold">
                  <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button className="w-full bg-[#114A29] text-white p-3.5 rounded-xl shadow-md font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition active:scale-95">
              <FileText size={18} /> Download Full Report
            </button>
            <button className="w-full bg-white text-gray-700 border border-gray-200 p-3.5 rounded-xl shadow-sm font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition active:scale-95">
              <Share2 size={18} /> Share Impact Profile
            </button>
          </div>

        </div>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW (Tuza Juna Code - hidden md:block) */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Impact Overview</h1>
            <p className="text-gray-500 font-medium text-sm">Track your impact and see the difference</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
              <span className="font-bold text-gray-700 text-sm">This Year</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-200 shadow-sm cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Top 4 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">127</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Trees Planted</p>
            </div>
            <p className="text-xs font-bold text-green-600 mt-4">+33 this month</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">42</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Species Returned</p>
            </div>
            <p className="text-xs font-bold text-green-600 mt-4">+7 this month</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">18.6 ha</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Area Restored</p>
            </div>
            <p className="text-xs font-bold text-green-600 mt-4">+3.2 ha this month</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">2.4K kg</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">CO₂ Sequestered</p>
            </div>
            <p className="text-xs font-bold text-green-600 mt-4">+300 kg this month</p>
          </div>
        </div>

        {/* Main Grid: Chart & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section (Spans 2 cols) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Impact Over Time</h3>
            
            <div className="h-64 w-full relative">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 h-full flex flex-col justify-between text-xs text-gray-400 font-medium pb-8">
                <span>150</span>
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>
              
              {/* Graph Area */}
              <div className="ml-8 h-full relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full border-b border-gray-100"></div>
                  ))}
                </div>
                
                {/* SVG Multiple Lines */}
                <svg className="absolute inset-0 h-[calc(100%-2rem)] w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0,80 Q 20,65 40,50 T 60,40 T 80,30 T 100,15" fill="none" stroke="#16A34A" strokeWidth="2" />
                  <path d="M 0,90 Q 20,75 40,65 T 60,60 T 80,45 T 100,35" fill="none" stroke="#3B82F6" strokeWidth="2" />
                  <path d="M 0,95 Q 20,90 40,80 T 60,75 T 80,70 T 100,60" fill="none" stroke="#F97316" strokeWidth="2" />
                </svg>
                
                {/* X-Axis Labels */}
                <div className="absolute bottom-0 w-full flex justify-between text-[11px] text-gray-400 font-medium px-2">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                  <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                  <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-50 text-xs font-bold text-gray-600">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600"></span> Trees</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Species</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Area Restored</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> CO₂ Sequestered</div>
            </div>
          </div>

          {/* Right Card: Download Report */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-6">Download Report</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition text-left text-sm font-bold text-gray-700">
                  <FileText size={18} className="text-green-700" /> Impact Report (PDF)
                </button>
                <button className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition text-left text-sm font-bold text-gray-700">
                  <Share2 size={18} className="text-blue-600" /> Share Report
                </button>
                <button className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition text-left text-sm font-bold text-gray-700">
                  <Download size={18} className="text-gray-600" /> View All Reports
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ImpactTracker;