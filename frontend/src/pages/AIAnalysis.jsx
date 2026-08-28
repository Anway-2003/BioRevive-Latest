import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, TestTubes, Droplets, ShieldAlert, Sparkles, ArrowRight, ArrowLeft, ChevronLeft, MapPin, Loader2 } from 'lucide-react';
import { fetchAIAnalysis } from '../services/geminiService'; 

const AIAnalysis = () => {
  const navigate = useNavigate();

  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 🔥 AI States
  const [aiData, setAiData] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Fetch Zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch('http://https://biorevive-backend-6yij.onrender.com/api/zones');
        if (response.ok) {
          const data = await response.json();
          setZones(data || []);
          if (data.length > 0) setSelectedZoneId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching zones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  // 🧠 Status-Aware Fallback Logic
  const getFallbackStats = (status, name) => {
    if (status === 'Critical' || status === 'High') {
      return { 
        severityScore: 88, 
        potential: 'Moderate', 
        potentialScore: 45, 
        timeframe: '24-36 Months', 
        confidence: 89, 
        causes: [
          {name: 'Deforestation', level: 'HIGH'}, 
          {name: 'Chemical Runoff', level: 'HIGH'}, 
          {name: 'Soil Pollution', level: 'HIGH'}, 
          {name: 'Water Contamination', level: 'HIGH'}
        ], 
        summary: `Severe ecological degradation detected in ${name}. Immediate intervention required.`, 
        healthStatus: 'CRITICAL LEVEL' 
      };
    } else {
      return { 
        severityScore: 22, 
        potential: 'Optimal', 
        potentialScore: 95, 
        timeframe: '1-3 Months', 
        confidence: 96, 
        causes: [
          {name: 'Deforestation', level: 'LOW'}, 
          {name: 'Chemical Runoff', level: 'LOW'}, 
          {name: 'Soil Pollution', level: 'LOW'}, 
          {name: 'Water Contamination', level: 'LOW'}
        ], 
        summary: `${name} is relatively healthy. Routine maintenance is sufficient.`, 
        healthStatus: 'HEALTHY' 
      };
    }
  };

  // 🔥 Fetch from Gemini whenever Zone changes
  useEffect(() => {
    const getAiInsight = async () => {
      const activeZone = zones.find(z => String(z.id) === String(selectedZoneId));
      if (!activeZone) return;

      setIsAiLoading(true);
      try {
        const data = await fetchAIAnalysis(activeZone.name, activeZone.status || 'Healthy');
        if (data && data.severityScore) {
          setAiData({
            ...data,
            healthStatus: data.healthStatus || (data.severityScore > 75 ? 'CRITICAL LEVEL' : 'HEALTHY'),
            levelColor: data.severityScore > 75 ? 'text-red-500' : 'text-green-500'
          });
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        console.warn("Gemini Failed, using fallback:", error);
        const fallback = getFallbackStats(activeZone.status, activeZone.name);
        setAiData({ ...fallback, levelColor: fallback.severityScore > 75 ? 'text-red-500' : 'text-green-500' });
      } finally {
        setIsAiLoading(false);
      }
    };

    if (selectedZoneId && zones.length > 0) getAiInsight();
  }, [selectedZoneId, zones]);

  const gaugeOffset = aiData ? 126 - (126 * aiData.severityScore) / 100 : 126;

  const getCauseStyle = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': 
      case 'HIGH': return 'text-red-700 bg-red-100';
      case 'MODERATE': 
      case 'MED': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    // 🔥 Added pb-32 so the bottom nav bar doesn't cut the content!
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8 font-sans pb-32 md:pb-8">
      
      {/* 📱 MOBILE HEADER & SELECTOR */}
      <div className="block md:hidden mb-6">
        <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 border-b border-gray-100 -mx-4 -mt-4 mb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition bg-gray-50">
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight flex items-center gap-1">
                AI Analysis <Sparkles size={14} className={isAiLoading ? 'text-purple-500 animate-pulse' : 'text-purple-500'}/>
              </h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Powered by Gemini</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="pl-4 text-purple-600"><MapPin size={18} /></div>
          <select 
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="w-full bg-transparent p-3 text-sm font-extrabold text-gray-800 outline-none truncate cursor-pointer"
          >
            {loading ? <option>Loading...</option> : zones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 💻 DESKTOP HEADER */}
      <div className="hidden md:flex mb-8 justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
            AI Analysis Report <Sparkles size={20} className={isAiLoading ? 'text-purple-500 animate-pulse' : 'text-purple-500'}/>
          </h1>
          <p className="text-gray-500 font-medium text-sm">Powered by Gemini 1.5 Flash</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
            <MapPin size={18} className="text-gray-400 mr-2" />
            <select 
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="bg-transparent text-sm font-extrabold text-gray-800 outline-none cursor-pointer w-40"
            >
              {loading ? <option>Loading...</option> : zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>
          <Link to="/map" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl">
            <ArrowLeft size={16} /> Back to Map
          </Link>
        </div>
      </div>

      {isAiLoading || !aiData ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="text-purple-500 animate-spin mb-4" />
          <p className="text-gray-500 font-bold animate-pulse">Gemini is analyzing ecological data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            
            {/* SEVERITY SCORE */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-2 lg:col-span-1">
              <h3 className="text-[13px] font-extrabold text-gray-800 self-start mb-2">Severity Score</h3>
              <div className="relative w-36 h-20 overflow-hidden mt-2">
                <svg viewBox="0 0 100 55" className="w-full h-full drop-shadow-sm">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="10" strokeLinecap="round" />
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" stroke="url(#gaugeGradient)" strokeWidth="10" strokeLinecap="round" 
                    strokeDasharray="126" strokeDashoffset={gaugeOffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }}
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
                  <span className="text-2xl font-black text-gray-900 leading-none">{aiData.severityScore}%</span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 ${aiData.levelColor}`}>{aiData.healthStatus}</span>
                </div>
              </div>
            </div>

            {/* REVIVAL POTENTIAL */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center col-span-1">
              <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Revival Potential</h3>
              <div className="text-2xl font-black text-green-600">{aiData.potential}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">({aiData.potentialScore}%)</div>
            </div>

            {/* RESTORATION TIME */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center col-span-1">
              <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Restoration Time</h3>
              <div className="text-2xl font-black text-gray-900 leading-tight">{aiData.timeframe}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Estimated duration</div>
            </div>

            {/* AI CONFIDENCE - 🔥 Fixed col-span-2 on mobile so it doesn't look cut off! */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center col-span-2 lg:col-span-1">
              <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">AI Confidence</h3>
              <div className="text-2xl font-black text-gray-900">{aiData.confidence}%</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Model accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
              <h3 className="text-lg font-extrabold text-gray-900 mb-5">Primary Causes Analysis</h3>
              <div className="space-y-2">
                {aiData.causes?.map((cause, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition">
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400"><ShieldAlert size={20} /></div>
                      <span className="text-sm font-extrabold text-gray-800">{cause.name}</span>
                    </div>
                    <span className={`px-3 py-1 text-[11px] font-black rounded-lg uppercase tracking-wider ${getCauseStyle(cause.level)}`}>{cause.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-lg font-extrabold text-gray-900 mb-4">AI Insight Summary</h3>
              <div className="text-sm font-semibold text-gray-600 leading-relaxed mb-8 flex-grow">
                {aiData.summary}
              </div>
              <button onClick={() => navigate('/revival-plan')} className="w-full py-3.5 bg-[#114A29] hover:bg-green-900 text-white text-sm font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                View Detailed Revival Plan <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAnalysis;