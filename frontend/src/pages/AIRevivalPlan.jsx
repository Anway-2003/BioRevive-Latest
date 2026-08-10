import  { useState } from 'react';
import { CheckCircle2, Download, Wrench, FileText, ArrowLeft, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AIRevivalPlan = () => {
  const navigate = useNavigate();
  
  // State for Web View
  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState('timeline');
  
  // State for Mobile View
  const [mobileTab, setMobileTab] = useState('plan');

  // Data for phases (Used in Web)
  const phases = [
    { id: 1, title: 'Phase 1', duration: 'Months 1-3', name: 'Soil Remediation' },
    { id: 2, title: 'Phase 2', duration: 'Months 4-9', name: 'Native Planting' },
    { id: 3, title: 'Phase 3', duration: 'Months 10-15', name: 'Ecosystem Establishment' },
    { id: 4, title: 'Phase 4', duration: 'Months 16-24', name: 'Monitoring & Growth' },
  ];

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW (Fkt mobile var disel - block md:hidden) */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
        
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Revival Plan</h1>
            <p className="text-[10px] font-bold text-gray-500">Kharadi Industrial Area</p>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex bg-white px-4 pt-2 shadow-sm border-b border-gray-100 mb-5 justify-between">
          {['Plan', 'Timeline', 'Resources'].map((tab) => (
            <button
              key={tab.toLowerCase()}
              onClick={() => setMobileTab(tab.toLowerCase())}
              className={`pb-3 px-2 text-sm font-extrabold border-b-[3px] transition-all ${
                mobileTab === tab.toLowerCase() 
                  ? 'border-[#114A29] text-[#114A29]' 
                  : 'border-transparent text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-gray-900">24-Month Revival Plan</h2>
            <button className="text-gray-400 bg-gray-100 p-1.5 rounded-full">
              <span className="text-[10px] font-black px-1 tracking-widest">•••</span>
            </button>
          </div>

          {/* Phase 1 Card (Active) */}
          <div className="bg-green-50/60 border border-green-200/60 p-5 rounded-2xl mb-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#114A29]"></div>
            <h3 className="text-sm font-extrabold text-gray-900">Phase 1 (Months 1-3)</h3>
            <p className="text-sm font-bold text-[#114A29] mb-4">Soil Remediation</p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-xs font-bold text-gray-700">
                <span className="text-[#114A29] text-[10px] mt-0.5">●</span> Soil testing
              </li>
              <li className="flex items-start gap-2.5 text-xs font-bold text-gray-700">
                <span className="text-[#114A29] text-[10px] mt-0.5">●</span> Remove pollutants
              </li>
              <li className="flex items-start gap-2.5 text-xs font-bold text-gray-700">
                <span className="text-[#114A29] text-[10px] mt-0.5">●</span> Add organic compost
              </li>
              <li className="flex items-start gap-2.5 text-xs font-bold text-gray-700">
                <span className="text-[#114A29] text-[10px] mt-0.5">●</span> Improve soil structure
              </li>
            </ul>
          </div>

          {/* Phase 2 Card (Upcoming) */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl mb-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900">Phase 2 (Months 4-9)</h3>
            <p className="text-sm font-bold text-gray-600 mb-4">Native Planting</p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-xs font-bold text-gray-500">
                <span className="text-gray-300 text-[10px] mt-0.5">●</span> Plant native species
              </li>
              <li className="flex items-start gap-2.5 text-xs font-bold text-gray-500">
                <span className="text-gray-300 text-[10px] mt-0.5">●</span> Mulching
              </li>
              <li className="flex items-start gap-2.5 text-xs font-bold text-gray-500">
                <span className="text-gray-300 text-[10px] mt-0.5">●</span> Water conservation
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button className="w-full bg-[#114A29] text-white py-4 rounded-xl font-extrabold shadow-lg hover:bg-green-800 transition active:scale-95 flex items-center justify-center gap-2">
            View Full Plan PDF
          </button>
        </div>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW (Tuza Juna Code - hidden md:block) */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">24-Month Revival Plan</h1>
            <p className="text-gray-500 font-medium text-sm">AI-generated step-by-step ecosystem restoration roadmap</p>
          </div>
          <Link to="/analysis" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Analysis
          </Link>
        </div>

        {/* 1. Four Phases Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {phases.map((phase) => (
            <div 
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                activePhase === phase.id 
                  ? 'border-[#114A29] ring-2 ring-[#114A29]/20 shadow-md' 
                  : 'border-gray-100 shadow-sm hover:border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  activePhase === phase.id ? 'bg-[#114A29] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {phase.title}
                </span>
                <span className="text-xs font-bold text-gray-400">{phase.duration}</span>
              </div>
              <h3 className="font-extrabold text-gray-800 text-base">{phase.name}</h3>
            </div>
          ))}
        </div>

        {/* 2. Sub Tabs (Plan Timeline | Resources | Cost Estimate) */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-md">
          {[
            { id: 'timeline', label: 'Plan Timeline' },
            { id: 'resources', label: 'Resources' },
            { id: 'cost', label: 'Cost Estimate' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#114A29] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Phase Tasks (Spans 2 cols) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-6">
                Phase {activePhase}: {phases[activePhase - 1].name} ({phases[activePhase - 1].duration})
              </h3>
              
              <div className="space-y-4">
                {[
                  'Soil testing & laboratory chemical analysis',
                  'Remove heavy surface pollutants & industrial waste',
                  'Add organic compost & nutrient enrichers',
                  'Improve soil structure and moisture retention capacity'
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                    <span className="font-bold text-gray-700 text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Tools & Resources + Download PDF */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Wrench size={20} className="text-[#114A29]" /> Tools & Resources
              </h3>
              
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Soil Testing Kit', type: 'Hardware Equipment' },
                  { title: 'Compost Guide', type: 'PDF Document' },
                  { title: 'Remediation Methods', type: 'Technical Manual' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-50 p-2 rounded-lg text-green-700">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-400 font-medium">{item.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2">
              <Download size={18} /> Download Plan PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIRevivalPlan;