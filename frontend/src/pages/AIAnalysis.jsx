import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, TestTubes, Droplets, ShieldAlert, Sparkles, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';

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
        const response = await fetch('http://localhost:8080/api/zones');
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
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8 font-sans pb-24 md:pb-8">
      
      {/* 1. HEADER & DROPDOWN SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="md:hidden p-2 -ml-2 text-gray-700 hover:text-gray-900 transition">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">AI Analysis Report</h1>
          </div>
          <p className="text-sm font-semibold text-gray-500 flex items-center gap-1 mt-1 ml-10 md:ml-0">
            Powered by <span className="text-purple-600 font-bold flex items-center gap-1">Claude AI <Sparkles size={14} /></span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mt-2 md:mt-0 ml-10 md:ml-0">
          <div className="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Select Live Zone</div>
          
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select 
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="w-full md:w-auto appearance-none bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 shadow-sm cursor-pointer transition"
            >
              {loading ? <option>Loading...</option> : zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-gray-500"></div>
          </div>

          <Link to="/map" className="hidden md:flex px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition shadow-sm cursor-pointer items-center justify-center">
            Back to Map
          </Link>
        </div>
      </div>

      {/* 2. TOP STATS GRID (Responsive 2x2 on Mobile, 1x4 on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        
        {/* Dynamic Gauge Card */}
        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-2 md:col-span-1">
          <h3 className="text-[13px] font-extrabold text-gray-800 self-start mb-2">Severity Score</h3>
          <div className="relative w-36 h-20 overflow-hidden mt-2">
            <svg viewBox="0 0 100 55" className="w-full h-full drop-shadow-sm">
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
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-2xl font-black text-gray-900 leading-none transition-all">{aiData.severity}%</span>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 ${aiData.levelColor}`}>{aiData.levelText}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Metrics */}
        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Revival Potential</h3>
          <div className="text-2xl font-black text-green-600">{aiData.revival.split(' ')[0]}</div>
          <div className="text-xs font-bold text-gray-500 mt-1">{aiData.revival.split(' ').slice(1).join(' ')}</div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Restoration Time</h3>
          <div className="text-2xl font-black text-gray-900">{aiData.time}</div>
          <div className="text-xs font-bold text-gray-500 mt-1">Estimated duration</div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">AI Confidence</h3>
          <div className="text-2xl font-black text-gray-900">{aiData.confidence}%</div>
          <div className="text-xs font-bold text-gray-500 mt-1">Model accuracy</div>
        </div>

      </div>

      {/* 3. BOTTOM SECTION GRID (Causes & Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Dynamic Causes */}
        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-extrabold text-gray-900 mb-5">Primary Causes Analysis</h3>
          <div className="space-y-2">
            
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition">
              <div className="flex items-center gap-4">
                <div className="text-gray-400"><ShieldAlert size={20} /></div>
                <span className="text-sm font-extrabold text-gray-800">Deforestation</span>
              </div>
              <span className={`px-3 py-1 text-[11px] font-black rounded-lg uppercase tracking-wider ${getCauseStyle(aiData.causes.def)}`}>{aiData.causes.def}</span>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition">
              <div className="flex items-center gap-4">
                <div className="text-gray-400"><TestTubes size={20} /></div>
                <span className="text-sm font-extrabold text-gray-800">Chemical Runoff</span>
              </div>
              <span className={`px-3 py-1 text-[11px] font-black rounded-lg uppercase tracking-wider ${getCauseStyle(aiData.causes.chem)}`}>{aiData.causes.chem}</span>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition">
              <div className="flex items-center gap-4">
                <div className="text-gray-400"><TreePine size={20} /></div>
                <span className="text-sm font-extrabold text-gray-800">Soil Pollution</span>
              </div>
              <span className={`px-3 py-1 text-[11px] font-black rounded-lg uppercase tracking-wider ${getCauseStyle(aiData.causes.soil)}`}>{aiData.causes.soil}</span>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition">
              <div className="flex items-center gap-4">
                <div className="text-gray-400"><Droplets size={20} /></div>
                <span className="text-sm font-extrabold text-gray-800">Water Contamination</span>
              </div>
              <span className={`px-3 py-1 text-[11px] font-black rounded-lg uppercase tracking-wider ${getCauseStyle(aiData.causes.water)}`}>{aiData.causes.water}</span>
            </div>

          </div>
        </div>

        {/* Dynamic Summary & Button */}
        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-extrabold text-gray-900 mb-4">AI Insight Summary</h3>
          <div className="text-sm font-semibold text-gray-600 leading-relaxed mb-8 flex-grow">
            {aiData.summary}
          </div>
          <button 
            onClick={() => navigate('/revival-plan')}
            className="w-full py-3.5 bg-[#114A29] hover:bg-green-900 text-white text-sm font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            View Detailed Revival Plan <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIAnalysis;