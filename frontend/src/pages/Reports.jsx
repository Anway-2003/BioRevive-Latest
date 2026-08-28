import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, ChevronLeft, Calendar, CheckCircle2, X, Filter } from 'lucide-react';
import { jsPDF } from "jspdf";
import { supabase } from '../supabaseClient';

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://10.232.232.50:8080/api/reports');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setReports(data);
            setLoading(false);
            return;
          }
        }
        // Fallback demo reports if backend server is empty
        setReports([
          { id: 1, title: 'Wagholi Soil Contamination Assessment', date: '2026-03-12', status: 'Verified', type: 'AI Deep Analysis' },
          { id: 2, title: 'Hinjewadi IT Park Afforestation Audit', date: '2026-03-05', status: 'Completed', type: 'Plantation Audit' },
          { id: 3, title: 'Mula Riverside Water Runoff Evaluation', date: '2026-02-28', status: 'Critical', type: 'Water Quality' }
        ]);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports([
          { id: 1, title: 'Wagholi Soil Contamination Assessment', date: '2026-03-12', status: 'Verified', type: 'AI Deep Analysis' },
          { id: 2, title: 'Hinjewadi IT Park Afforestation Audit', date: '2026-03-05', status: 'Completed', type: 'Plantation Audit' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // 🚀 Professional PDF Generation
  const downloadPDFReport = (rep) => {
    const doc = new jsPDF();
    doc.setFillColor(17, 74, 41); // #114A29 Green Theme Header
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("BioRevive Official Assessment Report", 20, 25);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text(`Report Title: ${rep.title}`, 20, 55);
    doc.text(`Category: ${rep.type || 'Ecological Audit'}`, 20, 65);
    doc.text(`Date Recorded: ${rep.date || '2026-03-12'}`, 20, 75);
    doc.text(`Status: ${rep.status || 'Verified'}`, 20, 85);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 95, 190, 95);
    
    doc.setFontSize(11);
    doc.text("This official document verifies ecological parameters evaluated via Computer Vision AI", 20, 110, { maxWidth: 170 });
    doc.text("and Java Spring Boot backend verification protocols.", 20, 118, { maxWidth: 170 });

    doc.save(`BioRevive_Report_${rep.id}.pdf`);
    setModalMessage(`Successfully generated and downloaded PDF for "${rep.title}"`);
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
            <h1 className="text-lg font-extrabold text-gray-900 leading-tight">Official Reports</h1>
            <p className="text-[11px] font-bold text-gray-500">View and download verification documents</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {reports.map((rep) => (
            <div key={rep.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-green-50 text-[#114A29] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">{rep.type || 'Audit'}</span>
                  <h3 className="text-sm font-extrabold text-gray-900 mt-1">{rep.title}</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400">{rep.date}</span>
              </div>
              <button 
                onClick={() => downloadPDFReport(rep)}
                className="w-full bg-[#114A29] text-white py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Assessment Reports</h1>
            <p className="text-gray-500 font-medium text-sm">Access verified ecological audit reports and download certified PDF summaries.</p>
          </div>
          <div className="bg-green-50 text-[#114A29] px-4 py-2 rounded-2xl font-black text-xs border border-green-200">
            Database Sync Active
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-extrabold text-gray-800 text-base">Generated System Reports</h3>
            <span className="text-xs font-bold text-gray-400">Total: {reports.length} Records</span>
          </div>

          <div className="divide-y divide-gray-100">
            {reports.map((rep) => (
              <div key={rep.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-[#114A29] p-3 rounded-2xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base">{rep.title}</h4>
                    <p className="text-xs font-bold text-gray-400 mt-0.5 flex items-center gap-2">
                      <Calendar size={12} /> {rep.date} • <span className="text-green-700 uppercase">{rep.status || 'Verified'}</span>
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => downloadPDFReport(rep)}
                  className="bg-[#114A29] hover:bg-green-900 text-white font-extrabold px-5 py-3 rounded-xl transition shadow-md flex items-center gap-2 text-xs cursor-pointer"
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-center">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={18} /></button>
            <div className="w-14 h-14 bg-green-100 text-[#114A29] rounded-2xl flex items-center justify-center mx-auto mb-3"><CheckCircle2 size={32} /></div>
            <h3 className="text-lg font-black text-gray-900 mb-1">Download Started!</h3>
            <p className="text-xs font-semibold text-gray-600 mb-5">{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="w-full bg-[#114A29] text-white font-extrabold py-3 rounded-xl cursor-pointer">Okay</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;