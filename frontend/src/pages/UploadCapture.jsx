import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ArrowLeft, Sparkles, X, ChevronLeft, Camera, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const UploadCapture = () => {
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // 🚀 NAVIN STATE: Live GPS Location sathi
  const [locationData, setLocationData] = useState({ lat: null, lng: null, error: null, fetching: true });

  // Component load hotach Live Location ghyaychi
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: null,
            fetching: false
          });
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

  // 🚀 THE MASTER FLOW: Upload -> Geotag -> Create Zone -> Redirect to AI
  const handleAnalyzeAI = async () => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user ? user.id : 'anonymous';

      let uploadedImageUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80';

      // 1. Supabase Storage Upload
      if (selectedFiles.length > 0) {
        const file = selectedFiles[0]; 
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('zone-photos') 
          .upload(filePath, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('zone-photos')
            .getPublicUrl(filePath);
          
          if (publicUrlData?.publicUrl) {
            uploadedImageUrl = publicUrlData.publicUrl;
          }
        }
      } else if (previewUrls.length > 0) {
        uploadedImageUrl = previewUrls[0];
      }

      // 2. Auto-Create Zone in Java Database
      // GPS nassel tar default fallback location gheil
      const finalLat = locationData.lat || 18.5204; 
      const finalLng = locationData.lng || 73.8567;
      const autoZoneName = `Reported Area ${Math.floor(1000 + Math.random() * 9000)}`;

      const newZonePayload = {
        name: autoZoneName,
        latitude: finalLat,
        longitude: finalLng,
        status: "Critical" // Auto set to critical for AI to analyze
      };

      let newZoneId = null;
      try {
        const zoneRes = await fetch('http://https://biorevive-backend-6yij.onrender.com/api/zones', {
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

      // 3. Save Report Log
      const reportPayload = {
        userId: userId,
        zoneId: newZoneId,
        actionType: 'Dead Zone Photo Upload',
        description: `Uploaded live assessment photo for ${autoZoneName}.`,
        imageUrl: uploadedImageUrl
      };

      await fetch('http://https://biorevive-backend-6yij.onrender.com/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      }).catch(err => console.log("Report log notice:", err));

      // 4. Redirect to AI Analysis
      // Ekda backend la data gela ki AI analysis page aapoap backend madhun fetch karel
      navigate('/ai-analysis');

    } catch (error) {
      console.error("Upload error:", error);
      navigate('/ai-analysis'); 
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
          
          <label className="bg-green-50/50 border-2 border-dashed border-green-200 rounded-3xl h-56 flex flex-col items-center justify-center text-center p-6 shadow-sm relative overflow-hidden cursor-pointer hover:border-green-400 transition">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              capture="environment" 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#114A29_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="bg-white p-4 rounded-full text-[#114A29] mb-3 shadow-md relative z-10 animate-bounce">
              <Camera size={32} />
            </div>
            <h2 className="text-base font-extrabold text-gray-800 relative z-10">Tap to Capture Area</h2>
            <p className="text-xs font-bold text-gray-500 mt-1 relative z-10">Directly opens your camera</p>
          </label>

          {/* 🚀 LIVE ATTACHED GPS LOCATION */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-xl ${locationData.error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-gray-800 leading-tight">Current Mapped Sector</p>
              {locationData.fetching ? (
                <p className="text-[10px] font-bold text-blue-500 mt-0.5 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Acquiring GPS...</p>
              ) : locationData.error ? (
                <p className="text-[10px] font-bold text-red-500 mt-0.5 flex items-center gap-1"><AlertCircle size={10}/> GPS Error. Using fallback.</p>
              ) : (
                <p className="text-[10px] font-bold text-green-600 mt-0.5">
                  Lat: {locationData.lat?.toFixed(4)}, Lng: {locationData.lng?.toFixed(4)}
                </p>
              )}
            </div>
            {locationData.lat && !locationData.error && <CheckCircle2 className="text-green-500" size={18} />}
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
                    <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full backdrop-blur-sm cursor-pointer">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4">
            <button 
              onClick={handleAnalyzeAI}
              disabled={uploading || locationData.fetching}
              className="w-full bg-[#114A29] hover:bg-green-800 text-white font-extrabold py-4 rounded-xl transition shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {uploading ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} />} 
              {uploading ? 'Processing AI & Database...' : 'Analyze with AI'}
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

          {/* 🚀 LIVE ATTACHED GPS LOCATION (Desktop) */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-xl ${locationData.error ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-gray-800 leading-tight">Live Geolocation Tracking</p>
              {locationData.fetching ? (
                <p className="text-xs font-bold text-blue-500 mt-0.5 flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Acquiring Satellite GPS...</p>
              ) : locationData.error ? (
                <p className="text-xs font-bold text-red-500 mt-0.5 flex items-center gap-1"><AlertCircle size={12}/> Geolocation Blocked. Using Fallback.</p>
              ) : (
                <p className="text-xs font-bold text-green-600 mt-0.5">
                  Latitude: {locationData.lat?.toFixed(5)} | Longitude: {locationData.lng?.toFixed(5)}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-extrabold text-xs text-gray-500 uppercase tracking-wide mb-2">Tips for Accurate AI Assessment:</h4>
            <ul className="space-y-1.5 text-xs font-medium text-gray-600 list-disc list-inside">
              <li>Capture from multiple wide angles</li>
              <li>Include degraded edges and main pollution sources</li>
              <li>Clear daytime lighting yields highest accuracy</li>
            </ul>
          </div>

          {previewUrls.length > 0 && (
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
          )}

          <button 
            onClick={handleAnalyzeAI}
            disabled={uploading || locationData.fetching}
            className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-center cursor-pointer disabled:opacity-70"
          >
            {uploading ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} />} 
            {uploading ? 'Processing AI Data...' : 'Analyze with AI'}
          </button>

        </div>
      </div>

    </div>
  );
};

export default UploadCapture;