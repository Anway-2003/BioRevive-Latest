import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, TrendingUp, Award, ChevronRight, Plus, X, Activity } from 'lucide-react';
import { supabase } from '../supabaseClient';
import MobileSideMenu from '../components/MobileSideMenu';

const Dashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ zonesAdopted: 0, treesPlanted: 0 });
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState('Planted Tree');
  const [description, setDescription] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (userProfile) setProfile(userProfile);
      }

      let fetchedZones = [];
      try {
        const response = await fetch('http://localhost:8080/api/zones');
        if (response.ok) {
          fetchedZones = await response.json();
          const recentZones = [...fetchedZones].reverse().slice(0, 3);
          setZones(recentZones);
          if (recentZones.length > 0) setSelectedZoneId(recentZones[0].id);
        }
      } catch (javaError) {
        console.error("Java Zones API Error:", javaError);
      }

      let fetchedReports = [];
      try {
        const repResponse = await fetch('http://localhost:8080/api/reports');
        if (repResponse.ok) {
          fetchedReports = await repResponse.json();
          const recentReports = [...fetchedReports].reverse().slice(0, 3);
          setReports(recentReports);
        }
      } catch (javaError) {
        console.error("Java Reports API Error:", javaError);
      }

      setStats({
        zonesAdopted: fetchedZones.length || 0, 
        treesPlanted: fetchedReports.length || 0,
      });

    } catch (error) {
      console.error("Dashboard Data Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboardData();
  }, []);

  const handleAddReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please Login First!");
        return;
      }

      const newReportData = {
        userId: user.id,
        zoneId: selectedZoneId ? parseInt(selectedZoneId) : null,
        actionType: actionType,
        description: description || 'Contributed to ecosystem revival.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80'
      };

      const response = await fetch('http://localhost:8080/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReportData)
      });

      if (!response.ok) throw new Error("Failed to save activity in Java Backend");

      const currentPoints = profile?.points || 0;
      const newPoints = currentPoints + 10;
      
      await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          points: newPoints,
          full_name: profile?.full_name || user.email.split('@')[0] || 'User'
        });

      setProfile(prev => ({ ...prev, points: newPoints }));

      alert("🎉 Success! Eco-Activity Logged via Java Server! (+10 Points Added)");
      setIsModalOpen(false);
      setDescription('');
      loadDashboardData();

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-red-500';
      case 'High': return 'text-orange-500';
      case 'Watch': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getZoneName = (zId) => {
    if (!zId) return 'General Zone';
    const zone = zones.find(z => String(z.id) === String(zId));
    return zone ? zone.name : 'General Zone';
  };

  return (
    <div className="relative transition-all duration-300 w-full bg-[#F8FAFC]">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] pb-24 font-sans">
        
        {/* Main Green Background Block */}
        <div className="bg-[#114A29] rounded-b-3xl shadow-md pb-8">
          
          <div className="sticky top-0 z-50 bg-[#114A29] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MobileSideMenu />
              <div>
                <p className="text-[10px] text-green-200 font-medium -mb-1">Let's revive our city</p>
                <h1 className="text-xl font-extrabold text-white flex items-center">
                  Hello, {profile?.full_name?.split(' ')[0] || 'Anway'} 👋
                </h1>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex shrink-0 items-center justify-center overflow-hidden shadow">
              <img 
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="px-6 mt-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-green-200">Your Real Impact</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-500 hover:bg-green-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow transition cursor-pointer"
                >
                  <Plus size={12} /> Log Activity
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="block text-xl font-black text-white">{loading ? '...' : stats.zonesAdopted}</span>
                  <span className="text-[10px] text-green-100 font-medium">Total Zones</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="block text-xl font-black text-white">{loading ? '...' : stats.treesPlanted}</span>
                  <span className="text-[10px] text-green-100 font-medium">Activities</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="block text-xl font-black text-white">{profile?.points || 0}</span>
                  <span className="text-[10px] text-green-100 font-medium">Points Earned</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-4 space-y-5">
          {/* Reward Points */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Reward Points</h2>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-gray-900">{profile?.points || 0} pts</span>
                  <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                    <TrendingUp size={12} className="mr-1" /> Active
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-green-50 text-[#114A29] rounded-xl">
                <Award size={22} />
              </div>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-4">
              <div className="bg-[#114A29] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((profile?.points || 0), 100)}%` }}></div>
            </div>
          </div>

          {/* 🔥 NEW: RECENT ACTIVITY ADDED FOR MOBILE 🔥 */}
          <div>
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="font-extrabold text-gray-800 text-sm tracking-tight">Recent Activity</h3>
              <button onClick={() => navigate('/impact')} className="text-xs font-bold text-[#114A29] cursor-pointer">View All</button>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-xs text-gray-400 font-bold py-4 animate-pulse">Loading activities...</div>
              ) : reports.length === 0 ? (
                <div className="text-center text-xs text-gray-400 font-bold py-4 bg-white rounded-2xl border border-gray-100 shadow-sm">No recent activities.</div>
              ) : (
                reports.map(report => {
                  const rType = report.actionType || report.action_type || 'Eco Activity';
                  const rDesc = report.description || '';
                  const rZoneId = report.zoneId || report.zone_id;
                  const rImg = report.imageUrl || report.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80';

                  return (
                    <div key={report.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                      <img 
                        src={rImg} 
                        alt="Activity" 
                        className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-200"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80' }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5">{rType}</h4>
                        <p className="text-[11px] font-semibold text-gray-500 leading-tight">
                          {getZoneName(rZoneId)} • {rDesc}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Java DB Zones */}
          <div>
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="font-extrabold text-gray-800 text-sm tracking-tight">Recent Java DB Zones</h3>
              <button onClick={() => navigate('/map')} className="text-xs font-bold text-[#114A29] cursor-pointer">View All</button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-xs text-gray-400 font-bold py-4 animate-pulse">Loading Java zones...</div>
              ) : zones.length === 0 ? (
                <div className="text-center text-xs text-gray-400 font-bold py-4 bg-white rounded-2xl border border-gray-100 shadow-sm">No zones available.</div>
              ) : (
                zones.map((zone) => (
                  <div key={zone.id} onClick={() => navigate('/map')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-green-200 transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-[#114A29] font-bold text-xs uppercase shadow-sm">
                        {zone.status.substring(0,2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{zone.name}</h4>
                        <p className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${getStatusColor(zone.status)}`}>
                          ● {zone.status}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB DASHBOARD VIEW */}
      <div className="hidden md:block p-8 min-h-screen font-sans w-full">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              Welcome, {profile?.full_name?.split(' ')[0] || 'Anway'} 👋
            </h1>
            <p className="text-gray-500 font-medium mt-1">Here's your live impact overview</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#114A29] hover:bg-green-900 text-white font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus size={18} /> Log Activity
            </button>

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
              <div className="bg-green-100 p-2 rounded-lg text-green-700">
                <User size={18} />
              </div>
              <span className="font-bold text-gray-700 text-sm">{profile?.full_name?.split(' ')[0] || 'User'}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { value: loading ? '...' : stats.zonesAdopted, label: 'Total Zones' },
            { value: loading ? '...' : stats.treesPlanted, label: 'Activities Logged' },
            { value: `${profile?.points || 0} pts`, label: 'Reward Points' },
            { value: '78.4', label: 'Biodiversity Score' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition duration-300">
              <h2 className="text-4xl font-black text-green-800 mb-2">{stat.value}</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-900 text-lg">Biodiversity Score Over Time</h3>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">+12.6% this month</span>
            </div>
            
            <div className="h-64 w-full relative">
              <div className="absolute left-0 h-full flex flex-col justify-between text-xs text-gray-400 font-medium pb-6">
                <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
              </div>
              
              <div className="ml-8 h-full relative">
                <div className="absolute inset-0 flex flex-col justify-between pb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-b border-gray-100"></div>
                  ))}
                </div>
                
                <svg className="absolute inset-0 h-[calc(100%-1.5rem)] w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0,90 Q 20,85 40,75 T 60,50 T 80,40 T 100,30" fill="none" stroke="#3B82F6" strokeWidth="2" />
                  <path d="M 0,80 Q 20,70 40,60 T 60,30 T 80,25 T 100,10" fill="none" stroke="#16A34A" strokeWidth="3" />
                </svg>
                
                <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-400 font-medium">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                  <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-y-auto max-h-[350px] custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-900 text-lg">Recent Activity</h3>
              <button onClick={() => navigate('/map')} className="text-sm font-bold text-green-700 hover:text-green-900 transition cursor-pointer">View All</button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-sm text-gray-400 py-4 animate-pulse">Loading Java activities...</div>
              ) : reports.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-4 bg-gray-50 rounded-xl">No recent activities recorded yet.</div>
              ) : (
                reports.map(report => {
                  const rType = report.actionType || report.action_type || 'Eco Activity';
                  const rDesc = report.description || '';
                  const rZoneId = report.zoneId || report.zone_id;
                  const rImg = report.imageUrl || report.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80';

                  return (
                    <div key={report.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <img 
                        src={rImg} 
                        alt="Activity" 
                        className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-200"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80' }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{rType}</h4>
                        <p className="text-[11px] font-semibold text-gray-500 leading-tight">
                          {getZoneName(rZoneId)} • {rDesc}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-gray-900 text-lg">Live Zones (Java Backend)</h3>
            <button onClick={() => navigate('/map')} className="text-sm font-bold text-green-700 hover:text-green-900 transition cursor-pointer">View All Map</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
                <p className="text-sm text-gray-500 font-bold col-span-3 text-center">Connecting to Java Server...</p>
            ) : zones.length === 0 ? (
                <p className="text-sm text-gray-500 font-bold col-span-3 text-center bg-gray-50 py-4 rounded-xl">No zones in Java Database yet.</p>
            ) : (
              zones.map(zone => (
                <div key={zone.id} onClick={() => navigate('/map')} className="flex gap-4 items-center p-4 rounded-2xl bg-gray-50 hover:bg-green-50 transition cursor-pointer border border-gray-100 hover:border-green-200">
                  <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center font-black text-gray-800 text-sm uppercase">
                    {zone.status.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1">{zone.name}</h4>
                    <p className={`text-xs font-bold ${getStatusColor(zone.status)}`}>
                      Lat: {zone.latitude?.toFixed(2)}, Long: {zone.longitude?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <Activity className="text-green-600" size={20} /> Log Eco Activity
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Zone (Live)</label>
                <select 
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                  {zones.length === 0 && <option value="">No Zones Available</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Action Type</label>
                <select 
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600"
                >
                  <option value="Planted Tree">🌲 Planted Tree</option>
                  <option value="Watered Plants">💧 Watered Plants</option>
                  <option value="Cleaned Waste">🧹 Cleaned Waste</option>
                  <option value="Soil Maintenance">🌱 Soil Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Planted 5 Neem saplings near the park."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-green-600 h-24"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:opacity-70 cursor-pointer"
              >
                {submitting ? 'Submitting to Java...' : 'Submit Activity (+10 Points)'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;