import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { ChevronDown, User, TrendingUp, Award, ChevronRight, Plus, X, Activity } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. Supabase Dynamic States
  const [profile, setProfile] = useState(null);
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ zonesAdopted: 0, treesPlanted: 0 });
  const [loading, setLoading] = useState(true);

  // Modal States for Adding Activity
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState('Planted Tree');
  const [description, setDescription] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 2. Fetch Real Data from Supabase
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get Logged In Auth User
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch User Profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userProfile) setProfile(userProfile);
      }

      // Fetch Real Zones from DB
      const { data: zonesData } = await supabase
        .from('zones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (zonesData) {
        setZones(zonesData);
        if (zonesData.length > 0) setSelectedZoneId(zonesData[0].id);
      }

      // Fetch Real Activity Reports from DB
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*, zones(name)')
        .order('created_at', { ascending: false })
        .limit(3);

      if (reportsData) setReports(reportsData);

      // Fetch Counts for Stats
      const { count: zonesCount } = await supabase.from('zones').select('*', { count: 'exact', head: true });
      const { count: reportsCount } = await supabase.from('reports').select('*', { count: 'exact', head: true });

      setStats({
        zonesAdopted: zonesCount || 0,
        treesPlanted: reportsCount || 0,
      });

    } catch (error) {
      console.error("Dashboard Data Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 3. Add Activity / Report to Supabase
  const handleAddReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please Login First!");
        return;
      }

      // Insert Report into 'reports' table
      const { error: reportError } = await supabase.from('reports').insert([
        {
          user_id: user.id,
          zone_id: selectedZoneId || null,
          action_type: actionType,
          description: description || 'Contributed to ecosystem revival.',
          image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80'
        }
      ]);

      if (reportError) throw reportError;

      // Increment User Points (+10 Points per Activity)
      const currentPoints = profile?.points || 0;
      await supabase
        .from('profiles')
        .update({ points: currentPoints + 10 })
        .eq('id', user.id);

      alert("🎉 Activity Logged Successfully! (+10 Points Added)");
      setIsModalOpen(false);
      setDescription('');
      loadDashboardData(); // Refresh Data

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

  return (
    <div className="relative">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] pb-24 font-sans">
        
        {/* Top Header Section */}
        <div className="bg-[#114A29] text-white px-6 pt-6 pb-8 rounded-b-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs text-green-200 font-medium">Let's revive our city together</p>
              <h1 className="text-2xl font-extrabold">Hello, {profile?.full_name || 'Anway'} 👋</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden shadow">
              <img 
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Impact Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-green-200">Your Real Impact</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 hover:bg-green-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow"
              >
                <Plus size={12} /> Log Activity
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="block text-xl font-black text-white">{stats.zonesAdopted}</span>
                <span className="text-[10px] text-green-100 font-medium">Total Zones</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="block text-xl font-black text-white">{stats.treesPlanted}</span>
                <span className="text-[10px] text-green-100 font-medium">Activities</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="block text-xl font-black text-white">{profile?.points || 0}</span>
                <span className="text-[10px] text-green-100 font-medium">Points Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="px-4 -mt-4 space-y-5">
          
          {/* Biodiversity / Points Card */}
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
              <div className="bg-[#114A29] h-full rounded-full" style={{ width: `${Math.min((profile?.points || 0), 100)}%` }}></div>
            </div>
          </div>

          {/* Nearby Dead Zones Section */}
          <div>
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="font-extrabold text-gray-800 text-sm tracking-tight">Nearby Dead Zones</h3>
              <button onClick={() => navigate('/map')} className="text-xs font-bold text-[#114A29]">View All</button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-xs text-gray-400 font-bold py-4">Loading zones...</div>
              ) : zones.length === 0 ? (
                <div className="text-center text-xs text-gray-400 font-bold py-4">No zones available.</div>
              ) : (
                zones.map((zone) => (
                  <div key={zone.id} onClick={() => navigate('/map')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-[#114A29] font-bold text-xs uppercase">
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
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              Welcome, {profile?.full_name || 'Anway'} 👋
            </h1>
            <p className="text-gray-500 font-medium mt-1">Here's your live impact overview</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#114A29] hover:bg-green-900 text-white font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm"
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

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { value: stats.zonesAdopted, label: 'Total Zones' },
            { value: stats.treesPlanted, label: 'Activities Logged' },
            { value: `${profile?.points || 0} pts`, label: 'Reward Points' },
            { value: '78.4', label: 'Biodiversity Score' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <h2 className="text-4xl font-extrabold text-green-800 mb-2">{loading ? '...' : stat.value}</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Biodiversity Score Over Time</h3>
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
                  <path d="M 0,80 Q 20,70 40,60 T 60,30 T 80,25 T 100,10" fill="none" stroke="#16A34A" strokeWidth="2" />
                </svg>
                
                <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-400 font-medium">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                  <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section (Real from DB) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Recent Activity</h3>
              <button onClick={() => navigate('/map')} className="text-sm font-bold text-green-700 hover:text-green-900 transition">View All</button>
            </div>
            
            <div className="space-y-5">
              {loading ? (
                <div className="text-center text-sm text-gray-400 py-4">Loading activities...</div>
              ) : reports.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-4">No recent activities recorded yet.</div>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="flex items-center gap-4 group block">
                    <img 
                      src={report.image_url || 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&w=150&q=80'} 
                      alt="Activity" 
                      className="w-12 h-12 rounded-xl object-cover shadow-sm" 
                    />
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{report.action_type}</h4>
                      <p className="text-xs font-medium text-gray-500">{report.zones?.name || 'General Zone'} • {report.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Bottom Section: Nearby Dead Zones (Real from DB) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Nearby Dead Zones in DB</h3>
            <button onClick={() => navigate('/map')} className="text-sm font-bold text-green-700 hover:text-green-900 transition">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {zones.map(zone => (
              <div key={zone.id} onClick={() => navigate('/map')} className="flex gap-4 items-center p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-100 block">
                <div className="w-16 h-16 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center font-black text-green-800 text-xs">
                  {zone.status}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{zone.name}</h4>
                  <p className={`text-xs font-bold ${getStatusColor(zone.status)}`}>
                    Lat: {zone.latitude?.toFixed(2)}, Long: {zone.longitude?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 🚀 MODAL: LOG NEW ACTIVITY FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <Activity className="text-green-600" size={20} /> Log Eco Activity
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Zone</label>
                <select 
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
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
                className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md"
              >
                {submitting ? 'Submitting to Supabase...' : 'Submit Activity (+10 Points)'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;