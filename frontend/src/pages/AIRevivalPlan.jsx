import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Download, Wrench, ArrowLeft, ChevronLeft, MapPin, IndianRupee, Package, TreePine, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchRevivalPlan } from '../services/geminiService'; 

const AIRevivalPlan = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null); 
  
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); 

  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState('timeline');

  // 🔥 AI States
  const [dynamicPhases, setDynamicPhases] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch('http://10.232.232.50:8080/api/zones');
        if (response.ok) {
          const data = await response.json();
          setZones(data || []);
          if (data.length > 0) setSelectedZoneId(data[0].id);
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchZones();
  }, []);

  // 🔥 Status-Aware Fallback
  const getFallbackPlan = (status) => {
    if (status === 'Critical' || status === 'High') {
      return [
        { phase: 1, title: 'Aggressive Remediation', duration: 'Months 1-6', tasks: ['Deep soil chemical detox', 'Remove industrial pollutants', 'Barricade toxic sections'], resources: [{ title: 'Toxicity Kit', type: 'Hardware' }], costs: [{ item: 'Cleanup', amount: '₹45,000' }, { item: 'Total', amount: '₹45,000' }] },
        { phase: 2, title: 'Soil Restructuring', duration: 'Months 7-12', tasks: ['Inject organic compost', 'Bio-remediation bacteria'], resources: [{ title: 'Compost', type: 'Material' }], costs: [{ item: 'Compost', amount: '₹15,000' }, { item: 'Total', amount: '₹15,000' }] },
        { phase: 3, title: 'Pioneer Planting', duration: 'Months 13-24', tasks: ['Plant heavy-metal absorbing trees'], resources: [{ title: 'Saplings', type: 'Biological' }], costs: [{ item: 'Saplings', amount: '₹25,000' }, { item: 'Total', amount: '₹25,000' }] },
        { phase: 4, title: 'Ecosystem Stabilization', duration: 'Months 25-36', tasks: ['Introduce native insects', 'Test groundwater'], resources: [{ title: 'Water Kit', type: 'Hardware' }], costs: [{ item: 'Testing', amount: '₹10,000' }, { item: 'Total', amount: '₹10,000' }] }
      ];
    }
    return [
      { phase: 1, title: 'Basic Assessment', duration: 'Months 1-2', tasks: ['General site cleanup', 'Basic soil test'], resources: [{ title: 'Cleanup Tools', type: 'Hardware' }], costs: [{ item: 'Cleanup Crew', amount: '₹5,000' }, { item: 'Total', amount: '₹5,000' }] },
      { phase: 2, title: 'Maintenance Planting', duration: 'Months 3-5', tasks: ['Plant seasonal flowers', 'Light fertilizing'], resources: [{ title: 'Seeds', type: 'Biological' }], costs: [{ item: 'Seeds', amount: '₹3,000' }, { item: 'Total', amount: '₹3,000' }] },
      { phase: 3, title: 'Community Care', duration: 'Months 6-8', tasks: ['Organize watering drives'], resources: [{ title: 'Watering Cans', type: 'Material' }], costs: [{ item: 'Equipment', amount: '₹1,500' }, { item: 'Total', amount: '₹1,500' }] },
      { phase: 4, title: 'Sustained Growth', duration: 'Months 9-12', tasks: ['Monthly checks'], resources: [{ title: 'App Access', type: 'Software' }], costs: [{ item: 'Zero Cost', amount: '₹0' }, { item: 'Total', amount: '₹0' }] }
    ];
  };

  useEffect(() => {
    const getPlan = async () => {
      const activeZone = zones.find(z => String(z.id) === String(selectedZoneId));
      if (!activeZone) return;

      setIsAiLoading(true);
      setActivePhase(1);
      setActiveTab('timeline');
      
      try {
        const data = await fetchRevivalPlan(activeZone.name, activeZone.status || 'Healthy');
        if (data && data.length > 0) {
          setDynamicPhases(data);
        } else throw new Error("Invalid array");
      } catch (error) {
        console.warn("Gemini Failed, using fallback");
        setDynamicPhases(getFallbackPlan(activeZone.status));
      } finally {
        setIsAiLoading(false);
      }
    };

    if (selectedZoneId && zones.length > 0) getPlan();
  }, [selectedZoneId, zones]);

  const activeZoneName = zones.find(z => String(z.id) === String(selectedZoneId))?.name || 'Selected Zone';
  const currentPhaseData = dynamicPhases.find(p => p.phase === activePhase) || dynamicPhases[0];

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
      while (heightLeft > 0) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      pdf.save(`${activeZoneName.replace(/\s+/g, '_')}_Revival_Plan.pdf`);
    } catch (error) {
      alert("Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full relative overflow-x-hidden">
      
      {/* 📱 1. MOBILE APP VIEW (Optimized) */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-28 relative">
        
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition bg-gray-50">
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight flex items-center gap-1">
                Revival Plan <Sparkles size={14} className={isAiLoading ? 'text-purple-500 animate-pulse' : 'text-purple-500'}/>
              </h1>
              <p className="text-[10px] font-bold text-[#114A29] uppercase tracking-wide">For {activeZoneName}</p>
            </div>
          </div>
        </div>

        <div className="px-4 mt-5 space-y-6">
          {/* Mobile Zone Selector */}
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="pl-4 text-[#114A29]"><MapPin size={18} /></div>
            <select 
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="w-full bg-transparent p-3 text-sm font-extrabold text-gray-800 outline-none truncate"
            >
              {loading ? <option>Loading...</option> : zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>
          
          {isAiLoading || dynamicPhases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} className="text-purple-500 animate-spin mb-4" />
              <p className="text-xs text-gray-500 font-bold animate-pulse">Gemini is crafting a custom roadmap...</p>
            </div>
          ) : (
            <>
              {/* 4 Phases Interactive Grid (Compact 2x2) */}
              <div className="grid grid-cols-2 gap-3">
                {dynamicPhases.map((phase) => (
                  <div 
                    key={phase.phase}
                    onClick={() => setActivePhase(phase.phase)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      activePhase === phase.phase 
                        ? 'border-[#114A29] bg-green-50 shadow-sm' 
                        : 'border-transparent bg-white shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        activePhase === phase.phase ? 'bg-[#114A29] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        Phase {phase.phase}
                      </span>
                    </div>
                    <h3 className={`font-extrabold text-xs leading-tight ${activePhase === phase.phase ? 'text-[#114A29]' : 'text-gray-800'}`}>
                      {phase.title || phase.name}
                    </h3>
                    <p className="text-[9px] font-bold text-gray-400 mt-1">{phase.duration}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Tabs */}
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                {[
                  { id: 'timeline', label: 'Timeline' },
                  { id: 'resources', label: 'Resources' },
                  { id: 'cost', label: 'Budget' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all ${
                      activeTab === tab.id ? 'bg-[#114A29] text-white shadow-sm' : 'text-gray-500 bg-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Content Area (Mobile) */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 min-h-[250px]">
                {currentPhaseData && activeTab === 'timeline' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-sm font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">
                      Phase {currentPhaseData.phase} Tasks
                    </h3>
                    <div className="space-y-4">
                      {currentPhaseData.tasks?.map((task, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="font-bold text-gray-700 text-xs leading-relaxed">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentPhaseData && activeTab === 'resources' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-sm font-black text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Package size={16} className="text-[#114A29]"/> Required Tools
                    </h3>
                    <div className="space-y-3">
                      {currentPhaseData.resources?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="bg-white p-2 rounded-lg text-[#114A29] shadow-sm border border-gray-100">
                            <Wrench size={16} />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-gray-800 text-xs">{item.title}</h4>
                            <p className="text-[10px] text-gray-500 font-bold mt-0.5">{item.type}</p>
                          </div>
                        </div>
                      ))}
                      {!currentPhaseData.resources || currentPhaseData.resources.length === 0 ? <p className="text-xs text-gray-400 font-bold">No specific resources listed by AI.</p> : null}
                    </div>
                  </div>
                )}

                {currentPhaseData && activeTab === 'cost' && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-sm font-black text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <IndianRupee size={16} className="text-[#114A29]"/> Estimated Cost
                    </h3>
                    <div className="space-y-3">
                      {currentPhaseData.costs?.map((cost, idx) => {
                        const isTotal = cost.item === 'Total';
                        return (
                          <div key={idx} className={`flex justify-between items-center p-3 rounded-xl ${isTotal ? 'bg-[#114A29] text-white shadow-md mt-4' : 'bg-gray-50 border border-gray-100'}`}>
                            <span className={`text-xs ${isTotal ? 'font-black' : 'font-bold text-gray-700'}`}>{cost.item}</span>
                            <span className={`text-xs ${isTotal ? 'font-black text-green-300' : 'font-extrabold text-gray-900'}`}>{cost.amount}</span>
                          </div>
                        );
                      })}
                      {!currentPhaseData.costs || currentPhaseData.costs.length === 0 ? <p className="text-xs text-gray-400 font-bold">Cost estimation not available.</p> : null}
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button (Mobile) */}
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full bg-[#114A29] text-white py-4 rounded-xl font-extrabold shadow-lg hover:bg-green-800 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} 
                {isDownloading ? 'Generating PDF...' : 'Download Full Plan PDF'}
              </button>
            </>
          )}
        </div>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">Revival Plan <Sparkles size={20} className={isAiLoading ? 'text-purple-500 animate-pulse' : 'text-purple-500'}/></h1>
            <p className="text-gray-500 font-medium text-sm">System-generated restoration roadmap via Gemini AI</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex-1 md:flex-none">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <select 
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="bg-transparent text-sm font-extrabold text-gray-800 outline-none cursor-pointer w-full md:w-40"
              >
                {loading ? <option>Loading...</option> : zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl">
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        </div>

        {isAiLoading || dynamicPhases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-purple-500 animate-spin mb-4" />
            <p className="text-gray-500 font-bold animate-pulse">Gemini is crafting a custom roadmap...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {dynamicPhases.map((phase) => (
                <div key={phase.phase} onClick={() => setActivePhase(phase.phase)} className={`p-6 rounded-3xl border transition-all cursor-pointer bg-white ${activePhase === phase.phase ? 'border-[#114A29] ring-2 ring-[#114A29]/20 shadow-md' : 'border-gray-100 shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${activePhase === phase.phase ? 'bg-[#114A29] text-white' : 'bg-gray-100 text-gray-600'}`}>Phase {phase.phase}</span>
                    <span className="text-xs font-bold text-gray-400">{phase.duration}</span>
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-lg leading-tight">{phase.title || phase.name}</h3>
                </div>
              ))}
            </div>

            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-md">
              <button onClick={() => setActiveTab('timeline')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'timeline' ? 'bg-[#114A29] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Plan Timeline</button>
              <button onClick={() => setActiveTab('resources')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'resources' ? 'bg-[#114A29] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Resources</button>
              <button onClick={() => setActiveTab('cost')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'cost' ? 'bg-[#114A29] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Cost Estimate</button>
            </div>

            {currentPhaseData && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
                {activeTab === 'timeline' && (
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6">Phase {currentPhaseData.phase}: {currentPhaseData.title || currentPhaseData.name} <span className="text-gray-400 text-base font-bold ml-2">({currentPhaseData.duration})</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentPhaseData.tasks?.map((task, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                          <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                          <span className="font-bold text-gray-700 text-sm leading-relaxed">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'resources' && (
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2"><Package className="text-[#114A29]" /> Required Resources for Phase {currentPhaseData.phase}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {currentPhaseData.resources?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
                          <div className="bg-blue-50 p-4 rounded-xl text-blue-600"><Wrench size={24} /></div>
                          <div>
                            <h4 className="font-extrabold text-gray-800 text-sm mb-1">{item.title}</h4>
                            <p className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-md inline-block">{item.type}</p>
                          </div>
                        </div>
                      ))}
                      {!currentPhaseData.resources || currentPhaseData.resources.length === 0 ? <p className="text-gray-400 font-bold">No specific resources listed.</p> : null}
                    </div>
                  </div>
                )}

                {activeTab === 'cost' && (
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2"><IndianRupee className="text-[#114A29]" /> Budget Breakdown</h3>
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-extrabold tracking-wider">
                            <th className="p-4">Item / Service</th>
                            <th className="p-4 text-right">Estimated Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPhaseData.costs?.map((cost, idx) => {
                            const isTotal = cost.item === 'Total';
                            return (
                              <tr key={idx} className={`border-b border-gray-100 last:border-0 ${isTotal ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                                <td className={`p-4 text-sm ${isTotal ? 'font-black text-green-900' : 'font-bold text-gray-700'}`}>{cost.item}</td>
                                <td className={`p-4 text-sm text-right ${isTotal ? 'font-black text-green-900' : 'font-extrabold text-gray-900'}`}>{cost.amount}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-[#114A29] hover:bg-green-900 text-white font-extrabold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70">
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} Download Report
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🖨️ HIDDEN PDF REF */}
      <div className="absolute left-[-9999px] top-[-9999px] bg-white">
        <div ref={reportRef} className="w-[794px] h-auto p-12 font-sans text-gray-900 bg-white">
          <div className="border-b-4 border-[#114A29] pb-6 mb-8 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TreePine size={32} className="text-[#114A29]" />
                <h1 className="text-4xl font-black text-[#114A29] tracking-tight">BioRevive</h1>
              </div>
              <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">Ecosystem Restoration Plan</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-gray-900">{activeZoneName}</h2>
              <p className="text-sm font-extrabold text-gray-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mb-8">
            <h3 className="text-lg font-black text-[#114A29] mb-2">Executive Summary</h3>
            <p className="text-sm text-gray-700 font-medium">This roadmap has been generated using BioRevive AI Core for <strong>{activeZoneName}</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRevivalPlan;