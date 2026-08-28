import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Download, Wrench, FileText, ArrowLeft, ChevronLeft, MapPin, IndianRupee, Package, TreePine, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const AIRevivalPlan = () => {
  const navigate = useNavigate();
  const reportRef = useRef(null); 
  
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); 

  // Shared States for both Mobile and Web
  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState('timeline');

  // Fetch Live Zones
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

  useEffect(() => {
    setActivePhase(1);
    setActiveTab('timeline');
  }, [selectedZoneId]);

  // Dynamic Plan Generator
  const getDynamicPlan = () => {
    const activeZone = zones.find(z => String(z.id) === String(selectedZoneId));
    const status = activeZone ? activeZone.status : 'Healthy';

    if (status === 'Critical') {
      return [
        { 
          id: 1, title: 'Phase 1', duration: 'Months 1-4', name: 'Aggressive Remediation',
          tasks: ['Deep soil chemical extraction & detox', 'Remove heavy industrial pollutants', 'Install temporary water filters', 'Barricade highly toxic sections'],
          resources: [{ title: 'Toxicity Testing Kit', type: 'Hardware' }, { title: 'Industrial Filters', type: 'Equipment' }, { title: 'Hazmat Suits', type: 'Safety' }],
          costs: [{ item: 'Chemical Cleanup', amount: '₹45,000' }, { item: 'Filter Installation', amount: '₹12,000' }, { item: 'Labor', amount: '₹20,000' }, { item: 'Total', amount: '₹77,000' }]
        },
        { 
          id: 2, title: 'Phase 2', duration: 'Months 5-10', name: 'Soil Restructuring',
          tasks: ['Inject high-density organic compost', 'Introduce bio-remediation bacteria', 'Monitor PH levels weekly'],
          resources: [{ title: 'Bio-Bacteria Tanks', type: 'Biological' }, { title: 'Organic Compost', type: 'Material' }],
          costs: [{ item: 'Compost Procurement', amount: '₹15,000' }, { item: 'Bacteria Culture', amount: '₹8,000' }, { item: 'Total', amount: '₹23,000' }]
        },
        { 
          id: 3, title: 'Phase 3', duration: 'Months 11-18', name: 'Pioneer Planting',
          tasks: ['Plant heavy-metal absorbing plants', 'Implement drip irrigation', 'Weekly canopy assessment'],
          resources: [{ title: 'Irrigation Setup', type: 'Hardware' }, { title: 'Saplings (500x)', type: 'Biological' }],
          costs: [{ item: 'Saplings', amount: '₹25,000' }, { item: 'Irrigation Pipes', amount: '₹18,000' }, { item: 'Total', amount: '₹43,000' }]
        },
        { 
          id: 4, title: 'Phase 4', duration: 'Months 19-36', name: 'Long-term Stabilization',
          tasks: ['Introduce native insect species', 'Test groundwater purity', 'Community awareness campaign'],
          resources: [{ title: 'Water Testing Kit', type: 'Hardware' }, { title: 'Ecosystem Manual', type: 'Document' }],
          costs: [{ item: 'Testing Equipment', amount: '₹10,000' }, { item: 'Community Events', amount: '₹5,000' }, { item: 'Total', amount: '₹15,000' }]
        }
      ];
    } else if (status === 'High') {
      return [
        { 
          id: 1, title: 'Phase 1', duration: 'Months 1-3', name: 'Soil Remediation',
          tasks: ['Soil testing & laboratory chemical analysis', 'Remove heavy surface pollutants', 'Add organic compost', 'Improve soil structure'],
          resources: [{ title: 'Soil Testing Kit', type: 'Hardware' }, { title: 'Organic Compost', type: 'Material' }],
          costs: [{ item: 'Lab Testing', amount: '₹8,000' }, { item: 'Compost', amount: '₹12,000' }, { item: 'Total', amount: '₹20,000' }]
        },
        { 
          id: 2, title: 'Phase 2', duration: 'Months 4-9', name: 'Native Planting',
          tasks: ['Plant drought-resistant native species', 'Apply heavy mulching', 'Setup water conservation trenches'],
          resources: [{ title: 'Native Saplings', type: 'Biological' }, { title: 'Mulch Bags', type: 'Material' }],
          costs: [{ item: 'Saplings', amount: '₹15,000' }, { item: 'Mulch', amount: '₹4,000' }, { item: 'Total', amount: '₹19,000' }]
        },
        { 
          id: 3, title: 'Phase 3', duration: 'Months 10-15', name: 'Ecosystem Establishment',
          tasks: ['Monitor root growth', 'Check for local bird activity', 'Reduce artificial watering'],
          resources: [{ title: 'Growth Tracker', type: 'Software' }],
          costs: [{ item: 'Maintenance Labor', amount: '₹10,000' }, { item: 'Total', amount: '₹10,000' }]
        },
        { 
          id: 4, title: 'Phase 4', duration: 'Months 16-24', name: 'Monitoring & Growth',
          tasks: ['Quarterly biodiversity index check', 'Handover to local community'],
          resources: [{ title: 'Handover Doc', type: 'Document' }],
          costs: [{ item: 'Documentation', amount: '₹2,000' }, { item: 'Total', amount: '₹2,000' }]
        }
      ];
    } else {
      return [
        { 
          id: 1, title: 'Phase 1', duration: 'Months 1-2', name: 'Basic Assessment',
          tasks: ['General site cleanup', 'Basic soil moisture test', 'Trim dead vegetation'],
          resources: [{ title: 'Cleanup Tools', type: 'Hardware' }],
          costs: [{ item: 'Cleanup Crew', amount: '₹5,000' }, { item: 'Total', amount: '₹5,000' }]
        },
        { 
          id: 2, title: 'Phase 2', duration: 'Months 3-5', name: 'Maintenance Planting',
          tasks: ['Plant seasonal flowers', 'Light organic fertilizing'],
          resources: [{ title: 'Seasonal Seeds', type: 'Biological' }],
          costs: [{ item: 'Seeds & Fertilizer', amount: '₹3,000' }, { item: 'Total', amount: '₹3,000' }]
        },
        { 
          id: 3, title: 'Phase 3', duration: 'Months 6-8', name: 'Community Engagement',
          tasks: ['Organize weekend watering drives', 'Install bird feeders'],
          resources: [{ title: 'Bird Feeders', type: 'Material' }],
          costs: [{ item: 'Feeders', amount: '₹1,500' }, { item: 'Total', amount: '₹1,500' }]
        },
        { 
          id: 4, title: 'Phase 4', duration: 'Months 9-12', name: 'Sustained Care',
          tasks: ['Monthly visual checks', 'Update zone status in app'],
          resources: [{ title: 'App Access', type: 'Software' }],
          costs: [{ item: 'Zero Cost', amount: '₹0' }, { item: 'Total', amount: '₹0' }]
        }
      ];
    }
  };

  const dynamicPhases = getDynamicPlan();
  const currentPhaseData = dynamicPhases[activePhase - 1];
  const activeZoneName = zones.find(z => String(z.id) === String(selectedZoneId))?.name || 'Selected Zone';

  // 🚀 PDF DOWNLOAD LOGIC
  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
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
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full relative overflow-x-hidden">
      
      {/* 📱 1. PREMIUM MOBILE APP VIEW 🔥 */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-28 relative">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition bg-gray-50">
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight">Revival Plan</h1>
              <p className="text-[10px] font-bold text-[#114A29] uppercase tracking-wide">{activeZoneName}</p>
            </div>
          </div>
        </div>

        <div className="px-4 mt-5 space-y-6">
          
          {/* Zone Selector Dropdown */}
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="pl-4 text-[#114A29]"><MapPin size={18} /></div>
            <select 
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="w-full bg-transparent p-3 text-sm font-extrabold text-gray-800 outline-none"
            >
              {loading ? <option>Loading...</option> : zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>
          
          {/* 4 Phases Interactive Grid */}
          <div className="grid grid-cols-2 gap-3">
            {dynamicPhases.map((phase) => (
              <div 
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  activePhase === phase.id 
                    ? 'border-[#114A29] bg-green-50 shadow-sm' 
                    : 'border-transparent bg-white shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    activePhase === phase.id ? 'bg-[#114A29] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {phase.title}
                  </span>
                </div>
                <h3 className={`font-extrabold text-xs leading-tight ${
                  activePhase === phase.id ? 'text-[#114A29]' : 'text-gray-800'
                }`}>{phase.name}</h3>
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
            
            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-sm font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">
                  {currentPhaseData.title} Tasks
                </h3>
                <div className="space-y-4">
                  {currentPhaseData.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="font-bold text-gray-700 text-xs leading-relaxed">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-sm font-black text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Package size={16} className="text-[#114A29]"/> Required Tools
                </h3>
                <div className="space-y-3">
                  {currentPhaseData.resources.map((item, idx) => (
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
                </div>
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === 'cost' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-sm font-black text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <IndianRupee size={16} className="text-[#114A29]"/> Estimated Cost
                </h3>
                <div className="space-y-3">
                  {currentPhaseData.costs.map((cost, idx) => {
                    const isTotal = cost.item === 'Total';
                    return (
                      <div key={idx} className={`flex justify-between items-center p-3 rounded-xl ${isTotal ? 'bg-[#114A29] text-white shadow-md mt-4' : 'bg-gray-50 border border-gray-100'}`}>
                        <span className={`text-xs ${isTotal ? 'font-black' : 'font-bold text-gray-700'}`}>{cost.item}</span>
                        <span className={`text-xs ${isTotal ? 'font-black text-green-300' : 'font-extrabold text-gray-900'}`}>{cost.amount}</span>
                      </div>
                    );
                  })}
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
          
        </div>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW (No Changes here, already perfect!) */}
      <div className="hidden md:block p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header & Zone Selector */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Revival Plan</h1>
            <p className="text-gray-500 font-medium text-sm">System-generated restoration roadmap</p>
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
            
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl cursor-pointer">
              <ArrowLeft size={16} className="hidden md:block" /> <span className="hidden md:block">Back</span>
            </button>
          </div>
        </div>

        {/* 1. Four Phases Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dynamicPhases.map((phase) => (
            <div 
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer bg-white ${
                activePhase === phase.id 
                  ? 'border-[#114A29] ring-2 ring-[#114A29]/20 shadow-md transform scale-[1.02]' 
                  : 'border-gray-100 shadow-sm hover:border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  activePhase === phase.id ? 'bg-[#114A29] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {phase.title}
                </span>
                <span className="text-xs font-bold text-gray-400">{phase.duration}</span>
              </div>
              <h3 className="font-extrabold text-gray-800 text-lg leading-tight">{phase.name}</h3>
            </div>
          ))}
        </div>

        {/* 2. Interactive Tabs */}
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
                activeTab === tab.id ? 'bg-[#114A29] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Main Content Area */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] animate-in fade-in duration-300">
          
          {activeTab === 'timeline' && (
            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-extrabold text-gray-900">
                  {currentPhaseData.title}: {currentPhaseData.name} <span className="text-gray-400 text-base font-bold ml-2">({currentPhaseData.duration})</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPhaseData.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 transition">
                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-bold text-gray-700 text-sm leading-relaxed">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="text-[#114A29]" /> Required Resources for {currentPhaseData.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentPhaseData.resources.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                      <Wrench size={24} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-800 text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-md inline-block">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cost' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <IndianRupee className="text-[#114A29]" /> Budget Breakdown ({currentPhaseData.title})
              </h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-extrabold tracking-wider">
                      <th className="p-4">Item / Service</th>
                      <th className="p-4 text-right">Estimated Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPhaseData.costs.map((cost, idx) => {
                      const isTotal = cost.item === 'Total';
                      return (
                        <tr key={idx} className={`border-b border-gray-100 last:border-0 ${isTotal ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                          <td className={`p-4 text-sm ${isTotal ? 'font-black text-green-900' : 'font-bold text-gray-700'}`}>
                            {cost.item}
                          </td>
                          <td className={`p-4 text-sm text-right ${isTotal ? 'font-black text-green-900' : 'font-extrabold text-gray-900'}`}>
                            {cost.amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* DOWNLOAD BUTTON */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-[#114A29] hover:bg-green-900 text-white font-extrabold py-3.5 px-8 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} 
            {isDownloading ? 'Generating High-Res PDF...' : `Download PDF Report`}
          </button>
        </div>

      </div>

      {/* 🖨️ HIDDEN PDF REPORT TEMPLATE */}
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
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              This comprehensive 24-month roadmap has been generated using BioRevive AI Core for <strong>{activeZoneName}</strong>. The strategy focuses on systematic soil remediation, native biodiversity integration, and long-term ecosystem stabilization.
            </p>
          </div>

          <div className="space-y-8 pb-8">
            {dynamicPhases.map((phase, index) => (
              <div key={index} className="page-break-inside-avoid bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                
                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                  <span className="bg-[#114A29] text-white px-3 py-1 rounded-lg text-sm font-black">{phase.title}</span>
                  <h4 className="text-xl font-black text-gray-900">{phase.name} <span className="text-gray-400 text-base font-bold">({phase.duration})</span></h4>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-xs font-black text-gray-400 mb-3 uppercase tracking-wider">Key Objectives</h5>
                    <ul className="space-y-3">
                      {phase.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                          <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" /> {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs font-black text-gray-400 mb-3 uppercase tracking-wider">Resources Needed</h5>
                      <ul className="space-y-2">
                        {phase.resources.map((res, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Package size={14} className="text-blue-500" /> {res.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h5 className="text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">Phase Budget</h5>
                      {phase.costs.filter(c => c.item === 'Total').map((c, i) => (
                        <div key={i} className="text-2xl font-black text-[#114A29]">{c.amount}</div>
                      ))}
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 text-center pb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confidential • BioRevive AI Core • {new Date().getFullYear()}</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AIRevivalPlan;