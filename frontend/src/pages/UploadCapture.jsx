import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ArrowLeft, Sparkles, X, ChevronLeft, Camera, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Helper function to convert image file for Gemini AI
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

const UploadCapture = () => {
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // 🔥 Navin state UI sathi

  // 🚀 Live GPS Location
  const [locationData, setLocationData] = useState({ lat: null, lng: null, error: null, fetching: true });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://biorevive-backend-6yij.onrender.com/api";
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // `.env` madhla Gemini Key

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({ lat: position.coords.latitude, lng: position.coords.longitude, error: null, fetching: false });
        },
        (err) => {
          console.warn("GPS Error:", err);
          setLocationData({ lat: null, lng: null, error: err.message, fetching: false });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationData({ lat: null, lng: null, error: 'GPS not supported', fetching: false });
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      const newUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 🚀 THE MASTER AI FLOW
  const handleAnalyzeAI = async () => {
    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user ? user.id : 'anonymous';

      let base64Image = null;
      let mimeType = null;
      let uploadedImageUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80';

      if (selectedFiles.length > 0) {
        const file = selectedFiles[0]; 
        mimeType = file.type;
        
        // 1. Convert to Base64 for Gemini
        setUploadStatus('Preparing image for Gemini AI...');
        base64Image = await fileToBase64(file);

        // 2. Upload to Supabase Storage
        setUploadStatus('Uploading image to cloud...');
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('zone-photos').upload(filePath, file);
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('zone-photos').getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) uploadedImageUrl = publicUrlData.publicUrl;
        }
      }

      // 3. ✨ GEMINI VISION AI CALL ✨ (Analyze Image for Name & Status)
      setUploadStatus('Gemini is analyzing the environment...');
      let aiZoneName = `Reported Area ${Math.floor(1000 + Math.random() * 9000)}`;
      let aiStatus = "Watch"; // Default fallback

      if (base64Image && GEMINI_API_KEY) {
        try {
          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: "Analyze this environmental/landscape image. 1. Give it a short, highly descriptive 3-4 word name (e.g., 'Polluted River Bank', 'Dry Urban Park', 'Healthy Forest Edge'). 2. Assign its ecological degradation status STRICTLY from one of these exact four words: 'Critical', 'High', 'Watch', 'Healthy'. RETURN ONLY a valid JSON object like this: {\"name\": \"...\", \"status\": \"...\"}" },
                  { inline_data: { mime_type: mimeType, data: base64Image } }
                ]
              }]
            })
          });
          const geminiData = await geminiRes.json();
          const textResponse = geminiData.candidates[0].content.parts[0].text;
          
          // Clean markdown backticks to parse JSON safely
          const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedJson);
          
          aiZoneName = parsed.name || aiZoneName;
          aiStatus = parsed.status || aiStatus;
          console.log("🤖 Gemini Assessment:", parsed);
        } catch (err) {
          console.warn("Gemini Vision failed, using defaults:", err);
        }
      }

      // 4. Save to Java Backend with Live GPS + AI Details
      setUploadStatus('Saving geotagged zone to database...');
      const finalLat = locationData.lat || 18.5204; 
      const finalLng = locationData.lng || 73.8567;

      const newZonePayload = {
        name: aiZoneName,    // 🔥 Generated by Gemini
        latitude: finalLat,  // 📍 Live GPS location
        longitude: finalLng, // 📍 Live GPS location
        status: aiStatus     // 🔥 Generated by Gemini based on photo
      };

      let newZoneId = null;
      try {
        const zoneRes = await fetch(`${API_BASE_URL}/zones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newZonePayload)
        });
        if (zoneRes.ok) {
          const createdZone = await zoneRes.json();
          newZoneId = createdZone.id;
        }
      } catch (err) {
        console.error("Failed to auto-create zone:", err);
      }

      // 5. Save Report Log
      const reportPayload = {
        userId: userId,
        zoneId: newZoneId,
        actionType: 'AI Assessed Photo Upload',
        description: `Uploaded geotagged photo. AI categorized it as [${aiStatus}].`,
        imageUrl: uploadedImageUrl
      };
      await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      }).catch(err => console.log("Report log notice:", err));

      // 6. Redirect to AI Analysis
      navigate('/ai-analysis');

    } catch (error) {
      console.error("Upload error:", error);
      navigate('/ai-analysis'); 
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="w-full">
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans relative flex flex-col pb-24">
        <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition cursor-pointer">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 leading-tight">Report Dead Zone</h1>
            <p className="text-[11px] font-bold text-gray-500">Upload photos for AI assessment</p>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-5">
          <label className="bg-green-50/50 border-2 border-dashed border-green-200 rounded-3xl h-56 flex flex-col items-center justify-center text-center p-6 shadow-sm relative overflow-hidden cursor-pointer hover:border-green-400 transition">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#114A29_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="bg-white p-4 rounded-full text-[#114A29] mb-3 shadow-md relative z-10 animate-bounce">
              <Camera size={32} />
            </div>
            <h2 className="text-base font-extrabold text-gray-800 relative z-10">Tap to Capture / Upload</h2>
            <p className="text-xs font-bold text-gray-500 mt-1 relative z-10">Select Camera or Gallery</p>
          </label>

          {/* 📍 Mobile GPS */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${locationData.error ? 'bg-red-50 text-red-600' : 'bg-[#EAF6ED] text-[#114A29]'}`}>
              <MapPin size={22} />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-extrabold text-[#001738] leading-tight">Live Geolocation Tracking</p>
              {locationData.fetching ? (
                <p className="text-[13px] font-medium text-blue-500 mt-1 flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Acquiring...</p>
              ) : locationData.error ? (
                <p className="text-[13px] font-medium text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> GPS Error. Using fallback.</p>
              ) : (
                <p className="text-[13px] font-medium text-[#114A29] mt-1">
                  Latitude: {locationData.lat?.toFixed(5)} | Longitude: {locationData.lng?.toFixed(5)}
                </p>
              )}
            </div>
          </div>

          {previewUrls.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wide">Attached Media ({previewUrls.length})</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                {previewUrls.map((imgUrl, idx) => (
                  <div key={idx} className="w-20 h-20 flex-shrink-0 relative rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full backdrop-blur-sm cursor-pointer"><X size={10} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4">
            <button 
              onClick={handleAnalyzeAI}
              disabled={uploading || locationData.fetching || selectedFiles.length === 0}
              className="w-full bg-[#114A29] hover:bg-green-800 text-white font-extrabold py-4 rounded-xl transition shadow-lg active:scale-95 flex flex-col items-center justify-center cursor-pointer disabled:opacity-70"
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="animate-spin mb-1"/>
                  <span className="text-xs">{uploadStatus}</span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={18} /> Analyze with AI
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:flex p-8 bg-[#F8FAFC] min-h-screen font-sans w-full items-center justify-center">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Capture Dead Zone</h1>
              <p className="text-xs font-bold text-gray-400 mt-0.5">Upload photos of the area for AI assessment</p>
            </div>
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-gray-800 transition flex items-center gap-1 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <label className="border-2 border-dashed border-gray-200 hover:border-green-600 transition rounded-2xl p-8 text-center bg-gray-50/50 mb-6 cursor-pointer group block">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            <div className="flex justify-center mb-3">
              <div className="bg-green-50 p-3 rounded-full text-green-700 group-hover:scale-110 transition"><UploadCloud size={24} /></div>
            </div>
            <p className="text-sm font-bold text-gray-700 mb-1">Drag & drop images here or browse</p>
            <p className="text-xs font-medium text-gray-400 mb-4">Supports high-res satellite & ground photos</p>
            <span className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition inline-block">Browse Files</span>
          </label>

          {/* 📍 Desktop GPS */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-xl ${locationData.error ? 'bg-red-50 text-red-600' : 'bg-[#EAF6ED] text-[#114A29]'}`}>
              <MapPin size={22} />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-extrabold text-[#001738] leading-tight">Live Geolocation Tracking</p>
              {locationData.fetching ? (
                <p className="text-[13px] font-medium text-blue-500 mt-1 flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Acquiring Satellite GPS...</p>
              ) : locationData.error ? (
                <p className="text-[13px] font-medium text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> Geolocation Blocked. Using Fallback.</p>
              ) : (
                <p className="text-[13px] font-medium text-[#114A29] mt-1">
                  Latitude: {locationData.lat?.toFixed(5)} | Longitude: {locationData.lng?.toFixed(5)}
                </p>
              )}
            </div>
          </div>

          {previewUrls.length > 0 && (
            <div className="mb-8">
              <h4 className="font-extrabold text-xs text-gray-500 uppercase tracking-wide mb-3">Images Preview ({previewUrls.length})</h4>
              <div className="grid grid-cols-3 gap-4">
                {previewUrls.map((imgUrl, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden h-24 border border-gray-100 shadow-sm group bg-gray-100">
                    <img src={imgUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <button onClick={() => removeImage(idx)} className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition cursor-pointer"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleAnalyzeAI}
            disabled={uploading || locationData.fetching || selectedFiles.length === 0}
            className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md flex flex-col items-center justify-center text-center cursor-pointer disabled:opacity-70"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin mb-1"/>
                <span className="text-xs">{uploadStatus}</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles size={18} /> Analyze with AI
              </div>
            )}
          </button>

        </div>
      </div>

    </div>
  );
};

export default UploadCapture;