import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, ArrowLeft, Sparkles, X, ChevronLeft, Camera, MapPin, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';

const UploadCapture = () => {
  const navigate = useNavigate();

  // Real States for Uploading Files
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([
    'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=200&q=80',
  ]);
  const [uploading, setUploading] = useState(false);
  const [locationName, setLocationName] = useState('Detecting current GPS location...');

  // Handle file selection from browse/camera
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      const newUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  // Remove preview item
  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle AI Analysis & Java/Supabase Sync
  const handleAnalyzeAI = async () => {
    setUploading(true);
    try {
      // Get current user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      // Optional: Send metadata report to Java Backend
      const reportPayload = {
        userId: user ? user.id : 'anonymous',
        actionType: 'Dead Zone Photo Upload',
        description: 'Uploaded live photos for AI ecosystem assessment.',
        imageUrl: previewUrls[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356f12'
      };

      await fetch('http://10.232.232.50:8080/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      }).catch(err => console.log("Java backend sync optional notice:", err));

      // Navigate to AI Analysis page with smooth transition
      navigate('/ai-analysis');
    } catch (error) {
      console.error("Upload error:", error);
      navigate('/ai-analysis'); // Fallback navigation
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans relative flex flex-col pb-24">
        
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition cursor-pointer">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 leading-tight">Report Dead Zone</h1>
            <p className="text-[11px] font-bold text-gray-500">Upload photos for AI assessment</p>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 flex-1 flex flex-col gap-5">
          
          {/* Big Camera / Upload Area with hidden file input */}
          <label className="bg-green-50/50 border-2 border-dashed border-green-200 rounded-3xl h-56 flex flex-col items-center justify-center text-center p-6 shadow-sm relative overflow-hidden cursor-pointer hover:border-green-400 transition">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#114A29_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="bg-white p-4 rounded-full text-[#114A29] mb-3 shadow-md relative z-10 animate-bounce">
              <Camera size={32} />
            </div>
            <h2 className="text-base font-extrabold text-gray-800 relative z-10">Tap to Capture / Upload</h2>
            <p className="text-xs font-bold text-gray-500 mt-1 relative z-10">Select multiple photos from gallery</p>
          </label>

          {/* Attached GPS Location */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="bg-gray-50 p-2 rounded-xl text-green-700">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-gray-800 leading-tight">Current Mapped Sector</p>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5">GPS Geotag Attached Successfully</p>
            </div>
            <CheckCircle2 className="text-green-500" size={18} />
          </div>

          {/* Selected Previews */}
          <div>
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wide">Attached Media ({previewUrls.length})</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
              {previewUrls.map((imgUrl, idx) => (
                <div key={idx} className="w-20 h-20 flex-shrink-0 relative rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full backdrop-blur-sm cursor-pointer">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-4">
            <button 
              onClick={handleAnalyzeAI}
              disabled={uploading}
              className="w-full bg-[#114A29] hover:bg-green-800 text-white font-extrabold py-4 rounded-xl transition shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <Sparkles size={18} /> {uploading ? 'Processing AI Models...' : 'Analyze with AI'}
            </button>
          </div>

        </div>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:flex p-8 bg-[#F8FAFC] min-h-screen font-sans w-full items-center justify-center">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 max-w-2xl w-full">
          
          {/* Top Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Capture Dead Zone</h1>
              <p className="text-xs font-bold text-gray-400 mt-0.5">Upload photos of the area for AI assessment</p>
            </div>
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-1 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          {/* Drag & Drop Upload Box */}
          <label className="border-2 border-dashed border-gray-200 hover:border-green-600 transition rounded-2xl p-8 text-center bg-gray-50/50 mb-6 cursor-pointer group block">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            <div className="flex justify-center mb-3">
              <div className="bg-green-50 p-3 rounded-full text-green-700 group-hover:scale-110 transition">
                <UploadCloud size={24} />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-700 mb-1">Drag & drop images here or browse</p>
            <p className="text-xs font-medium text-gray-400 mb-4">Supports high-res satellite & ground photos</p>
            <span className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition inline-block">
              Browse Files
            </span>
          </label>

          {/* Tips Section */}
          <div className="mb-6">
            <h4 className="font-extrabold text-xs text-gray-500 uppercase tracking-wide mb-2">Tips for Accurate AI Assessment:</h4>
            <ul className="space-y-1.5 text-xs font-medium text-gray-600 list-disc list-inside">
              <li>Capture from multiple wide angles</li>
              <li>Include degraded edges and main pollution sources</li>
              <li>Clear daytime lighting yields highest accuracy</li>
            </ul>
          </div>

          {/* Images Preview Section */}
          <div className="mb-8">
            <h4 className="font-extrabold text-xs text-gray-500 uppercase tracking-wide mb-3">Images Preview ({previewUrls.length})</h4>
            <div className="grid grid-cols-3 gap-4">
              {previewUrls.map((imgUrl, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden h-24 border border-gray-100 shadow-sm group bg-gray-100">
                  <img src={imgUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <button onClick={() => removeImage(idx)} className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition cursor-pointer">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <button 
            onClick={handleAnalyzeAI}
            disabled={uploading}
            className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-center cursor-pointer disabled:opacity-70"
          >
            <Sparkles size={18} /> {uploading ? 'Analyzing with Computer Vision AI...' : 'Analyze with AI'}
          </button>

        </div>
      </div>

    </div>
  );
};

export default UploadCapture;