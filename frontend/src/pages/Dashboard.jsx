import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, User, TrendingUp, Award, Plus, X, Activity, Users, 
  Building, ShieldCheck, CircleDollarSign, Megaphone, Loader2, Menu,
  LayoutDashboard, Map as MapIcon, Leaf, Heart, FileText, BookOpen, LogOut 
} from 'lucide-react'; 
import { supabase } from '../supabaseClient';
import { fetchTelemetryData, fetchZones, fetchReports, submitReport } from '../services/api';
import { useSwarmCycle } from '../hooks/useSwarmCycle';
import SwarmInsightsCard from '../components/SwarmInsightsCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ zonesAdopted: 0, treesPlanted: 0 });
  const [telemetry, setTelemetry] = useState(null);

  // 🚀 Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isNgoModalOpen, setIsNgoModalOpen] = useState(false); 
  const [isCorpModalOpen, setIsCorpModalOpen] = useState(false); 

  // Form States
  const [actionType, setActionType] = useState('Planted Tree');
  const [description, setDescription] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // NGO Form States
  const [driveName, setDriveName] = useState('');
  const [driveDate, setDriveDate] = useState('');

  // Corporate Form States
  const [fundAmount, setFundAmount] = useState('');

  // Role Onboarding Modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Individual');
  const [savingRole, setSavingRole] = useState(false);

  const { swarmInsights } = useSwarmCycle(selectedZoneId || 'zone1', telemetry);

  const getSeasonInfo = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 6) return { name: 'Summer', icon: '☀️', class: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    if (month >= 7 && month <= 9) return { name: 'Monsoon', icon: '🌧️', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    if (month >= 10 && month <= 11) return { name: 'Post-Monsoon', icon: '🍂', class: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
    return { name: 'Winter', icon: '❄️', class: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
  };

  const currentSeason = getSeasonInfo();

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let currentRole = 'Individual';

        if (user && isMounted) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!userProfile || !userProfile.role) {
            setShowRoleModal(true);
            setProfile(userProfile || { full_name: user.user_metadata?.full_name || 'User', points: 0 }); 
          } else {
            setProfile(userProfile);
            currentRole = userProfile.role;
          }
        }

        const fetchedZones = await fetchZones();
        if (isMounted) {
          const recentZones = [...fetchedZones].reverse().slice(0, 3);
          setZones(recentZones);
          setSelectedZoneId('');
        }

        const fetchedReports = await fetchReports();
        if (isMounted) {
          let roleBasedReports = [];

          if (currentRole === 'Organization') {
            roleBasedReports = fetchedReports.filter(r => r.description && r.description.includes('[ESG_FUNDING]'));
          } else if (currentRole === 'NGO') {
            roleBasedReports = fetchedReports.filter(r => r.description && r.description.includes('[NGO_DRIVE]'));
          } else {
            roleBasedReports = fetchedReports.filter(r => 
              (!r.description || !r.description.includes('[ESG_FUNDING]')) && 
              (!r.description || !r.description.includes('[NGO_DRIVE]'))
            );
          }

          const recentReports = [...roleBasedReports].reverse().slice(0, 3);

          setReports(recentReports);
          setStats({
            zonesAdopted: fetchedZones.length || 0,
            treesPlanted: roleBasedReports.length || 0, 
          });
        }
      } catch (error) {
        console.error('Dashboard Data Fetch Error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchTelemetry = async () => {
      try {
        const data = await fetchTelemetryData('zone1');
        if (data && isMounted) setTelemetry(data);
      } catch (error) {
        console.error('Telemetry Fetch Error:', error);
      }
    };

    fetchInitialData();
    fetchTelemetry();

    const interval = setInterval(fetchTelemetry, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSaveRole = async (e) => {
    e.preventDefault();
    setSavingRole(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fullName = user.user_metadata?.full_name || user.email.split('@')[0];

      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        role: selectedRole,
        points: profile?.points || 0
      });

      const { data: updatedProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(updatedProfile);
      setShowRoleModal(false);
      alert('Profile completed successfully! 🌍');
    } catch (error) {
      alert('Error saving role: ' + error.message);
    } finally {
      setSavingRole(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    if (!selectedZoneId) return alert('Please select a zone first!');
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await submitReport({
        userId: user.id,
        zoneId: parseInt(selectedZoneId),
        actionType: actionType,
        description: description || 'Contributed to ecosystem revival.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
      });
      const newPoints = (profile?.points || 0) + 10;
      await supabase.from('profiles').upsert({ id: user.id, points: newPoints, full_name: profile?.full_name, role: profile?.role });
      setProfile((prev) => ({ ...prev, points: newPoints }));

      alert('🎉 Success! Eco-Activity Logged via Java Server! (+10 Points Added)');
      setIsModalOpen(false);
      setDescription('');
      setSelectedZoneId('');
      setStats(prev => ({ ...prev, treesPlanted: prev.treesPlanted + 1 }));
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNgoSubmit = async (e) => {
    e.preventDefault();
    if (!selectedZoneId) return alert('Please select a Target Zone!');
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await submitReport({
        userId: user.id,
        zoneId: parseInt(selectedZoneId),
        actionType: 'Planted Tree', 
        description: `[NGO_DRIVE] Organized drive: "${driveName}" scheduled on ${driveDate}.`, 
        imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?auto=format&fit=crop&w=300&q=80',
      });

      const newPoints = (profile?.points || 0) + 50;
      await supabase.from('profiles').upsert({ id: user.id, points: newPoints, full_name: profile?.full_name, role: profile?.role });
      setProfile((prev) => ({ ...prev, points: newPoints }));

      alert(`📢 Success! Plantation Drive scheduled. (+50 Points)`);
      setIsNgoModalOpen(false);
      setDriveName('');
      setDriveDate('');
      setSelectedZoneId('');
      setStats(prev => ({ ...prev, treesPlanted: prev.treesPlanted + 1 }));
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCorpSubmit = async (e) => {
    e.preventDefault();
    if (!selectedZoneId) return alert('Please select a Zone to Fund!');
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const addedScore = Math.floor(fundAmount / 1000); 
      const newPoints = (profile?.points || 0) + addedScore;

      await submitReport({
        userId: user.id,
        zoneId: parseInt(selectedZoneId),
        actionType: 'Planted Tree', 
        description: `[ESG_FUNDING] Funded ₹${fundAmount} towards ecosystem revival.`, 
        imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=300&q=80',
      });

      await supabase.from('profiles').upsert({ id: user.id, points: newPoints, full_name: profile?.full_name, role: profile?.role });
      setProfile((prev) => ({ ...prev, points: newPoints }));

      alert(`💰 Thank you! ₹${fundAmount} allocated. ESG Score increased by ${addedScore} points!`);
      setIsCorpModalOpen(false);
      setFundAmount('');
      setSelectedZoneId('');
      setStats(prev => ({ ...prev, treesPlanted: prev.treesPlanted + 1 }));
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getZoneName = (zId) => {
    if (!zId) return 'General Zone';
    const zone = zones.find((z) => String(z.id) === String(zId));
    return zone ? zone.name : 'General Zone';
  };

  // 🔥 Mobile Menu Links Array
  const mobileNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Zones & Maps', path: '/map', icon: MapIcon },
    { name: 'AI Analysis', path: '/ai-analysis', icon: Activity },
    { name: 'Native Species', path: '/species', icon: Leaf },
    { name: 'Adopt Zone', path: '/adopt', icon: Heart },
    { name: 'Impact Tracker', path: '/impact', icon: TrendingUp },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Profile Settings', path: '/profile', icon: User },
  ];

  return (
    <div className="relative transition-all duration-300 w-full bg-[#F8FAFC]">

      {/* 🚀 MOBILE SLIDING MENU DRAWER (Hamburger List) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] flex md:hidden">
          {/* Dark Overlay Background */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Sidebar */}
          <div className="relative w-[280px] max-w-[80%] bg-[#0A2215] h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400 font-extrabold text-xl">
                🌱 <span className="text-white">BioRevive</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-md transition bg-white/5">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {mobileNavLinks.map((item) => (
                <div 
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition cursor-pointer font-bold text-sm ${
                    location.pathname === item.path 
                      ? 'bg-[#114A29] text-white shadow-md' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className={location.pathname === item.path ? 'text-green-400' : ''} />
                  {item.name}
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 w-full px-4 py-3.5 rounded-xl font-bold transition cursor-pointer"
              >
                <LogOut size={20} /> Secure Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] pb-24 font-sans">
        <div className="bg-[#114A29] text-white px-6 pt-6 pb-8 rounded-b-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {/* 🔥 Hamburger Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="text-white hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer active:scale-95"
              >
                <Menu size={26} />
              </button>
              <div>
                <p className="text-[11px] text-green-200 font-medium leading-tight tracking-wider uppercase">Let's revive our city</p>
                <h1 className="text-xl font-extrabold leading-tight">Hello, {profile?.full_name?.split(' ')[0] || 'User'} 👋</h1>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden shadow">
              <img src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-green-200">Your Real Impact</p>
              
              {profile?.role === 'Organization' ? (
                <button onClick={() => setIsCorpModalOpen(true)} className="bg-purple-500 hover:bg-purple-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow transition cursor-pointer">
                  <CircleDollarSign size={12} /> Fund ESG
                </button>
              ) : profile?.role === 'NGO' ? (
                <button onClick={() => setIsNgoModalOpen(true)} className="bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow transition cursor-pointer">
                  <Megaphone size={12} /> Organize Drive
                </button>
              ) : (
                <button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow transition cursor-pointer">
                  <Plus size={12} /> Log Activity
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="block text-xl font-black text-white">{loading ? '...' : stats.zonesAdopted}</span>
                <span className="text-[10px] text-green-100 font-medium">Total Zones</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="block text-xl font-black text-white">{loading ? '...' : stats.treesPlanted}</span>
                <span className="text-[10px] text-green-100 font-medium">Records</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="block text-xl font-black text-white">{profile?.points || 0}</span>
                <span className="text-[10px] text-green-100 font-medium">
                  {profile?.role === 'Organization' ? 'ESG Score' : 'Points Earned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-4 space-y-5">
          <div className="bg-gradient-to-br from-green-900 to-[#114A29] text-white p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-green-200">🌱 Live IoT Stream</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentSeason.class}`}>
                  {currentSeason.icon} {currentSeason.name}
                </span>
              </div>
              <span className="text-[10px] bg-green-500/30 px-2 py-0.5 rounded-full text-green-100 font-bold">
                {telemetry?.status || 'Active'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/10 p-2 rounded-xl">
                <p className="text-green-200">Moisture</p>
                <p className="font-bold">{telemetry ? `${telemetry.soilMoisture.toFixed(1)}%` : '...'}</p>
              </div>
              <div className="bg-white/10 p-2 rounded-xl">
                <p className="text-green-200">Temp</p>
                <p className="font-bold">{telemetry ? `${telemetry.temperature.toFixed(1)} °C` : '...'}</p>
              </div>
            </div>
          </div>

          <SwarmInsightsCard insights={swarmInsights} />

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {profile?.role === 'Organization' ? 'Total Corporate ESG Score' : 'Total Reward Points'}
                </h2>
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

          {/* 🔥 Mobile Recent Activity Log */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-gray-900 text-sm">Recent Activity</h3>
              <button onClick={() => navigate('/map')} className="text-[10px] font-bold text-green-700 hover:text-green-900 transition cursor-pointer">View All</button>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-xs text-gray-400 py-4 animate-pulse">Loading activities...</div>
              ) : reports.length === 0 ? (
                <div className="text-center text-xs text-gray-400 py-4 bg-gray-50 rounded-xl">No recent activities recorded.</div>
              ) : (
                reports.map((report) => {
                  let rDesc = report.description || '';
                  
                  let displayType = report.actionType || 'Eco Activity';
                  if (rDesc.includes('[ESG_FUNDING]')) {
                    displayType = 'ESG Funding';
                    rDesc = rDesc.replace('[ESG_FUNDING] ', '').replace('[ESG_FUNDING]', '');
                  } else if (rDesc.includes('[NGO_DRIVE]')) {
                    displayType = 'Plantation Drive';
                    rDesc = rDesc.replace('[NGO_DRIVE] ', '').replace('[NGO_DRIVE]', '');
                  }

                  const rZoneId = report.zoneId || report.zone_id;
                  const rImg = report.imageUrl || report.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80';

                  return (
                    <div key={report.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <img src={rImg} alt="Activity" className="w-10 h-10 rounded-lg object-cover shadow-sm bg-gray-200" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80'; }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-xs leading-tight mb-0.5 truncate">{displayType}</h4>
                        <p className="text-[10px] font-medium text-gray-500 leading-tight truncate">{getZoneName(rZoneId)} • {rDesc}</p>
                      </div>
                    </div>
                  );
                })
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
              Welcome, {profile?.full_name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              {profile?.role === 'Organization' ? "Corporate ESG Impact Dashboard" : 
               profile?.role === 'NGO' ? "NGO Community Action Dashboard" : 
               "Here's your live impact overview"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {profile?.role === 'Organization' ? (
              <button onClick={() => setIsCorpModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm cursor-pointer">
                <CircleDollarSign size={18} /> Fund Revival Project (ESG)
              </button>
            ) : profile?.role === 'NGO' ? (
              <button onClick={() => setIsNgoModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm cursor-pointer">
                <Megaphone size={18} /> Organize Plantation Drive
              </button>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="bg-[#114A29] hover:bg-green-900 text-white font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm cursor-pointer">
                <Plus size={18} /> Log Personal Activity
              </button>
            )}

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
              <div className="bg-green-100 p-2 rounded-lg text-green-700">
                {profile?.role === 'Organization' ? <Building size={18} /> : profile?.role === 'NGO' ? <Users size={18} /> : <User size={18} />}
              </div>
              <span className="font-bold text-gray-700 text-sm">{profile?.full_name?.split(' ')[0] || 'User'}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-[#114A29] text-white p-6 rounded-3xl shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">🌱 Live IoT Sensor Stream (Java Backend)</h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentSeason.class} flex items-center gap-1`}>
                {currentSeason.icon} {currentSeason.name} Season Engine Active
              </span>
            </div>
            <span className="text-xs bg-green-500/30 border border-green-400/30 px-3 py-1 rounded-full text-green-200 font-bold">
              {telemetry?.status || 'Connecting...'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-xs text-green-200 font-bold uppercase">Soil Moisture</p>
              <p className="text-2xl font-black mt-1">{telemetry ? `${telemetry.soilMoisture.toFixed(2)}%` : 'Loading...'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-xs text-green-200 font-bold uppercase">Temperature</p>
              <p className="text-2xl font-black mt-1">{telemetry ? `${telemetry.temperature.toFixed(2)} °C` : 'Loading...'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-xs text-green-200 font-bold uppercase">NPK Status</p>
              <p className="text-sm font-bold mt-2 text-green-100">{telemetry ? telemetry.npkLevel : 'Loading...'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <SwarmInsightsCard insights={swarmInsights} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { value: loading ? '...' : stats.zonesAdopted, label: 'Total Zones' },
            { value: loading ? '...' : stats.treesPlanted, label: profile?.role === 'NGO' ? 'Drives Conducted' : profile?.role === 'Organization' ? 'Fundings Done' : 'Activities Logged' },
            { value: `${profile?.points || 0} pts`, label: profile?.role === 'Organization' ? 'ESG Impact Score' : 'Reward Points' },
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
                  {[...Array(5)].map((_, i) => <div key={i} className="w-full border-b border-gray-100"></div>)}
                </div>
                <svg className="absolute inset-0 h-[calc(100%-1.5rem)] w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0,90 Q 20,85 40,75 T 60,50 T 80,40 T 100,30" fill="none" stroke="#3B82F6" strokeWidth="2" />
                  <path d="M 0,80 Q 20,70 40,60 T 60,30 T 80,25 T 100,10" fill="none" stroke="#16A34A" strokeWidth="3" />
                </svg>
                <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-400 font-medium">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-y-auto max-h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-900 text-lg">Recent Activity</h3>
              <button onClick={() => navigate('/map')} className="text-sm font-bold text-green-700 hover:text-green-900 transition cursor-pointer">View All</button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-sm text-gray-400 py-4 animate-pulse">Loading activities...</div>
              ) : reports.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-4 bg-gray-50 rounded-xl">No recent activities recorded.</div>
              ) : (
                reports.map((report) => {
                  let rDesc = report.description || '';
                  
                  let displayType = report.actionType || 'Eco Activity';
                  if (rDesc.includes('[ESG_FUNDING]')) {
                    displayType = 'ESG Funding';
                    rDesc = rDesc.replace('[ESG_FUNDING] ', '').replace('[ESG_FUNDING]', '');
                  } else if (rDesc.includes('[NGO_DRIVE]')) {
                    displayType = 'Plantation Drive';
                    rDesc = rDesc.replace('[NGO_DRIVE] ', '').replace('[NGO_DRIVE]', '');
                  }

                  const rZoneId = report.zoneId || report.zone_id;
                  const rImg = report.imageUrl || report.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80';

                  return (
                    <div key={report.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <img src={rImg} alt="Activity" className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-200" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80'; }} />
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{displayType}</h4>
                        <p className="text-[11px] font-semibold text-gray-500 leading-tight">{getZoneName(rZoneId)} • {rDesc}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 MODAL 1: CITIZEN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2"><Activity className="text-green-600" size={20} /> Log Eco Activity</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Zone (Live)</label>
                <select value={selectedZoneId} onChange={(e) => setSelectedZoneId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600 cursor-pointer" required>
                  <option value="" disabled>-- Select a Zone --</option>
                  {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Action Type</label>
                <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600 cursor-pointer" required>
                  <option value="Planted Tree">🌲 Planted Tree</option>
                  <option value="Watered Plants">💧 Watered Plants</option>
                  <option value="Cleaned Waste">🧹 Cleaned Waste</option>
                  <option value="Soil Maintenance">🌱 Soil Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Planted 5 Neem saplings near the park." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-green-600 h-24" required />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-2 cursor-pointer disabled:opacity-50">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'Submit Activity (+10 Points)'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🚀 MODAL 2: NGO */}
      {isNgoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2"><Megaphone className="text-blue-600" size={20} /> Schedule Plantation Drive</h3>
              <button onClick={() => setIsNgoModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleNgoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Zone</label>
                <select value={selectedZoneId} onChange={(e) => setSelectedZoneId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-blue-600 cursor-pointer" required>
                  <option value="" disabled>-- Select a Target Zone --</option>
                  {zones.map((z) => <option key={z.id} value={z.id}>{z.name} (Status: {z.status})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Event Name</label>
                <input type="text" value={driveName} onChange={(e) => setDriveName(e.target.value)} placeholder="e.g. Monsoon Mass Plantation" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-blue-600" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
                <input type="date" value={driveDate} onChange={(e) => setDriveDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-blue-600" required />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-2 cursor-pointer disabled:opacity-50">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'Notify Community & Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🚀 MODAL 3: CORPORATE */}
      {isCorpModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2"><CircleDollarSign className="text-purple-600" size={20} /> Allocate ESG Funds</h3>
              <button onClick={() => setIsCorpModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleCorpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Zone to Fund</label>
                <select 
                  value={selectedZoneId} 
                  onChange={(e) => setSelectedZoneId(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-purple-600 cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Select a Zone to Fund --</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} (Status: {z.status})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Funding Amount (₹)</label>
                <input type="number" min="1000" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="e.g. 50000" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-purple-600" required />
              </div>
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                <p className="text-xs text-purple-800 font-semibold">Estimated Impact: <span className="font-black">{Math.floor((fundAmount || 0) / 1000)} ESG Points</span></p>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-2 cursor-pointer disabled:opacity-50">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'Process ESG Funding'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🚀 ONBOARDING MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Complete Your Profile</h2>
              <p className="text-sm font-medium text-gray-500">Welcome to BioRevive! Please tell us how you will be contributing.</p>
            </div>
            <form onSubmit={handleSaveRole} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-3">I am joining as an:</label>
                <div className="grid grid-cols-1 gap-3">
                  <div onClick={() => setSelectedRole('Individual')} className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${selectedRole === 'Individual' ? 'border-[#114A29] bg-green-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className={`p-2 rounded-lg ${selectedRole === 'Individual' ? 'bg-[#114A29] text-white' : 'bg-gray-100 text-gray-500'}`}><User size={20} /></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Citizen</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">I want to track and report zones personally.</p>
                    </div>
                  </div>
                  <div onClick={() => setSelectedRole('NGO')} className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${selectedRole === 'NGO' ? 'border-[#114A29] bg-green-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className={`p-2 rounded-lg ${selectedRole === 'NGO' ? 'bg-[#114A29] text-white' : 'bg-gray-100 text-gray-500'}`}><Users size={20} /></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">NGO</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">We organize plantation drives & awareness.</p>
                    </div>
                  </div>
                  <div onClick={() => setSelectedRole('Organization')} className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${selectedRole === 'Organization' ? 'border-[#114A29] bg-green-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className={`p-2 rounded-lg ${selectedRole === 'Organization' ? 'bg-[#114A29] text-white' : 'bg-gray-100 text-gray-500'}`}><Building size={20} /></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Corporate</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">We sponsor eco-revival and track ESG impact.</p>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={savingRole} className="w-full bg-[#114A29] hover:bg-green-900 text-white font-extrabold py-4 rounded-xl transition shadow-xl disabled:opacity-70 cursor-pointer">
                {savingRole ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'Complete Setup & Go to Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;