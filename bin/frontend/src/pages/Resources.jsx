import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Download, Search, ChevronLeft, FileText, CheckCircle2, X } from 'lucide-react';
import { jsPDF } from "jspdf";

const Resources = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const resourcesList = [
    { id: 1, title: 'Soil Remediation Handbook (PDF)', category: 'Soil Health', desc: 'Step-by-step guidelines on reversing heavy metal chemical contamination in dead zones.', readTime: '10 min read' },
    { id: 2, title: 'Native Species Plantation Manual', category: 'Flora', desc: 'Complete list of drought-resistant and high oxygen-yielding local trees suitable for Maharashtra.', readTime: '15 min read' },
    { id: 3, title: 'National Afforestation Schemes Guide', category: 'Government', desc: 'Overview of grants, community funding frameworks, and ecological revival policies.', readTime: '8 min read' },
    { id: 4, title: 'Groundwater Revival & Harvesting Guide', category: 'Water', desc: 'Technical documentation on restoring natural water tables and eliminating runoff.', readTime: '12 min read' }
  ];

  const filteredResources = resourcesList.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadGuidePDF = (res) => {
    const doc = new jsPDF();
    doc.setFillColor(17, 74, 41);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("BioRevive Educational Resource Guide", 20, 25);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text(res.title, 20, 55);
    doc.setFontSize(11);
    doc.text(`Category: ${res.category} | Estimated Read: ${res.readTime}`, 20, 65);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, 190, 75);

    doc.setFontSize(12);
    doc.text(res.desc, 20, 90, { maxWidth: 170 });
    doc.text("Published by BioRevive Ecological Initiative. Empowering grassroots revival.", 20, 270, { maxWidth: 170 });

    doc.save(`BioRevive_Guide_${res.id}.pdf`);
    setModalMessage(`Successfully downloaded guide: "${res.title}"`);
    setShowModal(true);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen font-sans pb-24 relative">
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition cursor-pointer">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 leading-tight">Eco Resources</h1>
            <p className="text-[11px] font-bold text-gray-500">Manuals & revival guides</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="relative mb-3">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 outline-none"
            />
          </div>

          {filteredResources.map((res) => (
            <div key={res.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
              <span className="bg-green-50 text-[#114A29] text-[10px] font-black px-2 py-0.5 rounded uppercase w-fit">{res.category}</span>
              <h3 className="text-sm font-extrabold text-gray-900">{res.title}</h3>
              <p className="text-xs text-gray-600 font-medium">{res.desc}</p>
              <button 
                onClick={() => downloadGuidePDF(res)}
                className="mt-2 w-full bg-[#114A29] text-white py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={14} /> Download Manual (PDF)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Knowledge & Resources</h1>
            <p className="text-gray-500 font-medium text-sm">Explore expert handbooks, native plantation manuals, and soil remediation blueprints.</p>
          </div>
          
          <div className="relative w-72">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manuals..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 outline-none focus:border-[#114A29]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => (
            <div key={res.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:border-green-200 transition">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-green-100 text-[#114A29] text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">{res.category}</span>
                  <span className="text-xs font-bold text-gray-400">{res.readTime}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{res.title}</h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">{res.desc}</p>
              </div>

              <button 
                onClick={() => downloadGuidePDF(res)}
                className="bg-[#114A29] hover:bg-green-900 text-white font-extrabold px-6 py-3.5 rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Download size={16} /> Download Guide PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-center">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={18} /></button>
            <div className="w-14 h-14 bg-green-100 text-[#114A29] rounded-2xl flex items-center justify-center mx-auto mb-3"><CheckCircle2 size={32} /></div>
            <h3 className="text-lg font-black text-gray-900 mb-1">Download Ready!</h3>
            <p className="text-xs font-semibold text-gray-600 mb-5">{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="w-full bg-[#114A29] text-white font-extrabold py-3 rounded-xl cursor-pointer">Okay</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Resources;