import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, TestTubes, Droplets, ShieldAlert, Sparkles, ArrowRight, ChevronLeft, MapPin } from 'lucide-react';

const AIAnalysis = () => {
  const navigate = useNavigate();

  // 1. Dynamic States
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [loading, setLoading] = useState(true);

  // 2. Fetch Zones from Java Backend
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch('http://https://biorevive-backend-6yij.onrender.com/api/zones');
        if (response.ok) {
          const data = await response.json();
          setZones(data || []);
          if (data.length > 0) {
            setSelectedZoneId(data[0].id); // Default select first zone
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

  // 3. 🧠 AI Engine Logic (Status nusar dynamic data banavne)
  const getDynamicAIStats = () => {
    const activeZone = zones.find(z => String(z.id) === String(selectedZoneId));
    
    if (!activeZone) {
      return {
        severity: 0, revival: 'N/A', time: 'N/A', confidence: 0,
        causes: { def: 'Low', chem: 'Low', soil: 'Low', water: 'Low' },
        summary: 'Please select a valid zone to run AI Analysis.',
        levelText: 'UNKNOWN', levelColor: 'text-gray-500'
      };
    }

    const status = activeZone.status;
    
    // Status nusar AI metrics badalnar:
    if (status === 'Critical') {
      return {
        severity: 92, revival: 'Moderate (45%)', time: '24-36 Months', confidence: 89,
        causes: { def: 'High', chem: 'Critical', soil: 'High', water: 'High' },
        summary: `The AI analysis for ${activeZone.name} indicates severe ecological degradation. Primary contributors are severe chemical runoff and deforestation. Immediate intervention and strict soil remediation are strongly recommended.`,
        levelText: 'CRITICAL LEVEL', levelColor: 'text-red-500'
      };
    } else if (status === 'High') {
      return {
        severity: 76, revival: 'High (75%)', time: '18-24 Months', confidence: 92,
        causes: { def: 'High', chem: 'Moderate', soil: 'High', water: 'Moderate' },
        summary: `${activeZone.name} shows high stress levels, primarily due to soil pollution and declining tree density. Early remediation can prevent critical failure and restore the ecosystem.`,
        levelText: 'HIGH RISK', levelColor: 'text-orange-500'
      };
    } else if (status === 'Watch') {
      return {
        severity: 45, revival: 'Excellent (85%)', time: '6-12 Months', confidence: 94,
        causes: { def: 'Moderate', chem: 'Low', soil: 'Moderate', water: 'Low' },
        summary: `Ecosystem in ${activeZone.name} is currently stable but requires continuous monitoring. Minor signs of water contamination detected. Community plantation drives are suggested.`,
        levelText: 'MODERATE RISK', levelColor: 'text-yellow-500'
      };
    } else {
      return {
        severity: 22, revival: 'Optimal (95%)', time: '1-3 Months', confidence: 96,
        causes: { def: 'Low', chem: 'Low', soil: 'Low', water: 'Low' },
        summary: `${activeZone.name} is relatively healthy! Routine maintenance and maintaining current biodiversity standards are sufficient. Keep up the good work.`,
        levelText: 'HEALTHY', levelColor: 'text-green-500'
      };
    }
  };

  const aiData = getDynamicAIStats();
  // SVG gauge logic
  const gaugeOffset = 126 - (126 * aiData.severity) / 100;

  // Badge Color Helper
  const getCauseStyle = (level) => {
    switch (level) {
      case 'Critical': return 'text-red-700 bg-red-100';
      case 'High': return 'text-red-500 bg-red-50';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24">
        
        {/* Mobile App Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1 rounded-lg transition">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900">AI Analysis</h1>
        </div>

        <div className="p-5 space-y-5">
          {/* 🚀 Dynamic Zone Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Live Zone</label>
            <select 
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-[#114A29] shadow-sm outline-none focus:border-green-600"
            >
              {loading ? <option>Loading Java Zones...</option> : zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            Powered by <span className="text-purple-600 font-extrabold flex items-center gap-1">Claude AI <Sparkles size={12} /></span>
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 divide-y divide-gray-100 transition-all">
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Severity Score</span>
              <span className={`text-sm font-black ${aiData.levelColor}`}>{aiData.severity}%</span>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Revival Potential</span>
              <span className="text-sm font-black text-green-600">{aiData.revival}</span>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Deforestation</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getCauseStyle(aiData.causes.def)}`}>{aiData.causes.def}</span>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-gray-700">Chemical Runoff</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getCauseStyle(aiData.causes.chem)}`}>{aiData.causes.chem}</span>
            </div>
          </div>

          <div className="bg-green-50/50 rounded-2xl shadow-sm border border-green-100 p-5">
            <h3 className="text-sm font-extrabold text-gray-900 mb-2">AI Summary</h3>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">{aiData.summary}</p>
          </div>

          <button 
            onClick={() => navigate('/revival-plan')}
            className="w-full bg-[#114A29] text-white py-3.5 rounded-xl font-extrabold shadow-md hover:bg-green-800 transition active:scale-95"
          >
            View Revival Plan
          </button>
        </div>
      </div>

      
      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header & Dropdown */}
        <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">AI Analysis Report</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
              Powered by <span className="text-purple-600 font-bold">Claude AI</span> <Sparkles size={14} className="text-purple-500" />
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <select 
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="bg-transparent text-sm font-extrabold text-gray-800 outline-none cursor-pointer"
              >
                {loading ? <option>Loading...</option> : zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            
            <Link to="/map" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition bg-gray-100 px-4 py-2.5 rounded-xl">
              Back to Map
            </Link>
          </div>
        </div>

        {/* Top Grid: Gauge & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Dynamic Severity Score Gauge Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-all duration-500">
            <h3 className="w-full text-left font-extrabold text-gray-800 text-lg mb-4">Severity Score</h3>
            <div className="relative w-48 h-28 overflow-hidden flex items-end justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 55">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="10" strokeLinecap="round" />
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="url(#gaugeGradient)" 
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  strokeDasharray="126" 
                  strokeDashoffset={gaugeOffset} 
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="50%" stopColor="#EAB308" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 text-4xl font-black text-gray-900 transition-all">
                {aiData.severity}%
              </div>
            </div>
            <p className={`text-xs font-bold mt-2 uppercase tracking-wide ${aiData.levelColor}`}>
              {aiData.levelText}
            </p>
          </div>

          {/* Dynamic Metrics Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Revival Potential</p>
              <h4 className="text-2xl font-black text-green-600 mb-1">{aiData.revival.split(' ')[0]}</h4>
              <p className="text-xs font-bold text-gray-500">{aiData.revival.split(' ')[1]} success rate</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Restoration Time</p>
              <h4 className="text-2xl font-black text-gray-800 mb-1">{aiData.time}</h4>
              <p className="text-xs font-bold text-gray-500">Estimated duration</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Confidence</p>
              <h4 className="text-2xl font-black text-gray-800 mb-1">{aiData.confidence}%</h4>
              <p className="text-xs font-bold text-gray-500">Model accuracy</p>
            </div>
          </div>

        </div>

        {/* Bottom Section: Primary Causes & AI Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Dynamic Primary Causes */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-900 mb-6">Primary Causes Analysis</h3>
            <div className="space-y-6">
              
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl transition">
                    <ShieldAlert size={20} className="text-gray-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Deforestation</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCauseStyle(aiData.causes.def)}`}>{aiData.causes.def}</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl transition">
                    <TestTubes size={20} className="text-gray-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Chemical Runoff</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCauseStyle(aiData.causes.chem)}`}>{aiData.causes.chem}</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl transition">
                    <TreePine size={20} className="text-gray-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Soil Pollution</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCauseStyle(aiData.causes.soil)}`}>{aiData.causes.soil}</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl transition">
                    <Droplets size={20} className="text-gray-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Water Contamination</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCauseStyle(aiData.causes.water)}`}>{aiData.causes.water}</span>
              </div>

            </div>
          </div>

          {/* Dynamic AI Summary & Action */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-4">AI Insight Summary</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                {aiData.summary}
              </p>
            </div>
            
            <Link 
              to="/revival-plan" 
              className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-center"
            >
              View Detailed Revival Plan <ArrowRight size={18} />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AIAnalysis;