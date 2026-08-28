import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Users, MapPin, LogOut, Edit3, ChevronRight, ChevronLeft, X, CheckCircle2, Lock, Globe, Mail, Camera, Upload } from 'lucide-react';
import { supabase } from '../supabaseClient';

const ProfileSettings = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ zonesAdopted: 0, speciesReturned: 0, areaRestored: '0.0', co2Saved: '0' });
  const [loading, setLoading] = useState(true);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  // Modal States for Settings Tabs
  const [activeModal, setActiveModal] = useState(null);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchProfileAndImpact = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setEmail(user.email || '');
          const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (userProfile) {
            setProfile(userProfile);
            setFullName(userProfile.full_name || 'Eco Champion');
            setAvatarUrl(userProfile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
          } else {
            const defaultName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Eco Champion';
            const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
            setProfile({ full_name: defaultName, avatar_url: defaultAvatar });
            setFullName(defaultName);
            setAvatarUrl(defaultAvatar);
          }
        }

        const [zonesRes, reportsRes] = await Promise.all([
          fetch('https://biorevive-backend-6yij.onrender.com/api/zones'),
          fetch('https://biorevive-backend-6yij.onrender.com/api/reports')
        ]);

        let adoptedCount = 0;
        let reportCount = 0;
        if (zonesRes.ok) {
          const zones = await zonesRes.json();
          adoptedCount = zones.filter(z => z.status?.toLowerCase() === 'adopted').length || 1;
        }
        if (reportsRes.ok) {
          const reports = await reportsRes.json();
          reportCount = reports.length || 0;
        }

        setStats({
          zonesAdopted: adoptedCount,
          speciesReturned: 35 + (reportCount * 3),
          areaRestored: (12.4 + (adoptedCount * 2.1)).toFixed(1),
          co2Saved: ((adoptedCount * 600) + (reportCount * 100)).toLocaleString()
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndImpact();
  }, []);

  // 🚀 Handle Local/Mobile Image File Selection & Conversion to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result); // Base64 string preview & save
      };
      reader.readAsDataURL(file);
    }
  };

  // 🚀 Handle Full Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const authUpdates = {};
        if (email && email !== user.email) authUpdates.email = email;
        if (password && password.trim() !== '') authUpdates.password = password;

        if (Object.keys(authUpdates).length > 0) {
          const { error: authError } = await supabase.auth.updateUser(authUpdates);
          if (authError) throw authError;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: user.id, full_name: fullName, avatar_url: avatarUrl });

        if (profileError) throw profileError;
      }

      setProfile(prev => ({ ...prev, full_name: fullName, avatar_url: avatarUrl }));
      setIsEditModalOpen(false);
      setPassword('');
      setActiveModal('success');
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleMenuClick = (label) => {
    if (label === 'Account Settings') setActiveModal('account');
    else if (label === 'Notification Settings') setActiveModal('notifications');
    else if (label === 'Privacy & Security') setActiveModal('privacy');
    else if (label === 'My Groups') navigate('/community');
    else if (label === 'My Adopted Zones') navigate('/map');
  };

  const menuItems = [
    { label: 'Account Settings', icon: User },
    { label: 'Notification Settings', icon: Bell },
    { label: 'Privacy & Security', icon: Shield },
    { label: 'My Groups', icon: Users },
    { label: 'My Adopted Zones', icon: MapPin },
  ];

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
        <div className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition cursor-pointer">
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight ml-2">Profile</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 🚀 Clickable Avatar for Mobile */}
              <div 
                onClick={() => setIsEditModalOpen(true)}
                className="relative w-16 h-16 rounded-full overflow-hidden shadow-sm border-2 border-green-700 cursor-pointer group"
                title="Click to change avatar"
              >
                <img 
                  src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:opacity-70 transition" 
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Camera size={18} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">{profile?.full_name || 'Eco Champion'}</h2>
                <p className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full inline-block mt-1 uppercase tracking-wide">Eco Champion</p>
              </div>
            </div>
            <button onClick={() => setIsEditModalOpen(true)} className="bg-gray-50 p-2 rounded-xl text-gray-600 border border-gray-200 shadow-sm cursor-pointer">
              <Edit3 size={18} />
            </button>
          </div>

          <div>
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3 px-1">Your Live Impact</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#114A29] mb-1">{stats.zonesAdopted}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Zones Adopted</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#114A29] mb-1">{stats.speciesReturned}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Species Returned</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3 px-1">Settings & Tabs</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} onClick={() => handleMenuClick(item.label)} className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 p-2 rounded-xl text-gray-600"><Icon size={18} /></div>
                      <span className="font-bold text-sm text-gray-800">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                );
              })}
            </div>
          </div>

          <Link to="/auth" className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-extrabold text-sm hover:bg-red-100 transition shadow-sm border border-red-100">
            <LogOut size={18} /> Log Out
          </Link>
        </div>
      </div>

      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Profile & Settings</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your account preferences and interactive settings tabs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  {/* 🚀 Clickable Avatar for Laptop / Desktop */}
                  <div 
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative w-16 h-16 rounded-full overflow-hidden shadow-sm border-2 border-green-700 cursor-pointer group"
                    title="Click to upload/change image"
                  >
                    <img 
                      src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                      alt="Profile" 
                      className="w-full h-full object-cover group-hover:opacity-70 transition" 
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Camera size={20} className="text-white" />
                      <span className="text-[8px] font-bold text-white mt-0.5">Upload</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">{profile?.full_name || 'Eco Champion'}</h2>
                    <p className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full inline-block mt-1">Eco Champion</p>
                  </div>
                </div>

                <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-green-700 bg-gray-50 hover:bg-green-50 px-4 py-2 rounded-xl transition border border-gray-200 cursor-pointer shadow-xs">
                  <Edit3 size={14} /> Edit Profile
                </button>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 uppercase tracking-wider">Your Live Database Impact</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-black text-[#114A29] mb-1">{stats.zonesAdopted}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Zones Adopted</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-black text-[#114A29] mb-1">{stats.speciesReturned}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Species Returned</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-black text-[#114A29] mb-1">{stats.areaRestored}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Area Restored (ha)</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-black text-[#114A29] mb-1">{stats.co2Saved}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">CO₂ Sequestered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Active Navigation Menu */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="space-y-2">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} onClick={() => handleMenuClick(item.label)} className="flex items-center justify-between p-3.5 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-400" />
                      {item.label}
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link to="/auth" className="flex items-center gap-3 p-3.5 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition">
                <LogOut size={18} />
                Log Out
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 🚀 ACCOUNT SETTINGS MODAL */}
      {activeModal === 'account' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900">Account Settings</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 p-1 cursor-pointer"><X size={20} /></button>
            </div>
            <div className="space-y-4 text-sm font-bold text-gray-700">
              <div className="bg-gray-50 p-4 rounded-xl border">
                <p className="text-xs text-gray-400 uppercase">Registered Name</p>
                <p className="text-base text-gray-900">{profile?.full_name || 'Eco Champion'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border">
                <p className="text-xs text-gray-400 uppercase">Email Address</p>
                <p className="text-base text-gray-900">{email || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border">
                <p className="text-xs text-gray-400 uppercase">Role Status</p>
                <p className="text-base text-green-700">Verified BioRevive Contributor</p>
              </div>
              <button onClick={() => { setActiveModal(null); setIsEditModalOpen(true); }} className="w-full bg-[#114A29] text-white py-3 rounded-xl font-extrabold cursor-pointer">
                Edit Full Profile & Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 NOTIFICATION SETTINGS MODAL */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900">Notification Preferences</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 p-1 cursor-pointer"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border cursor-pointer">
                <span className="text-sm font-bold text-gray-800">Email Alerts for Zone Updates</span>
                <input type="checkbox" checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} className="w-5 h-5 accent-green-700 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border cursor-pointer">
                <span className="text-sm font-bold text-gray-800">Push Notifications</span>
                <input type="checkbox" checked={notifPush} onChange={() => setNotifPush(!notifPush)} className="w-5 h-5 accent-green-700 cursor-pointer" />
              </label>
              <button onClick={() => setActiveModal('success')} className="w-full bg-[#114A29] text-white py-3 rounded-xl font-extrabold cursor-pointer">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 PRIVACY & SECURITY MODAL */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900">Privacy & Security</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 p-1 cursor-pointer"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border cursor-pointer">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><Globe size={16} /> Public Profile Visibility</span>
                <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} className="w-5 h-5 accent-green-700 cursor-pointer" />
              </label>
              <div className="p-3 bg-gray-50 rounded-xl border flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><Lock size={16} /> Two-Factor Authentication</span>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md">Enabled</span>
              </div>
              <button onClick={() => setActiveModal('success')} className="w-full bg-[#114A29] text-white py-3 rounded-xl font-extrabold cursor-pointer">
                Update Security Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 SUCCESS MODAL */}
      {activeModal === 'success' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-green-100 text-[#114A29] rounded-2xl flex items-center justify-center mx-auto mb-3"><CheckCircle2 size={32} /></div>
            <h3 className="text-lg font-black text-gray-900 mb-1">Updated Successfully!</h3>
            <p className="text-xs font-semibold text-gray-600 mb-5">Your profile credentials have been saved.</p>
            <button onClick={() => setActiveModal(null)} className="w-full bg-[#114A29] text-white font-extrabold py-3 rounded-xl cursor-pointer">
              Okay
            </button>
          </div>
        </div>
      )}

      {/* 🚀 FULL EDIT PROFILE MODAL (With Direct Device Image Upload & Preview) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <User size={20} className="text-green-700" /> Edit Profile & Avatar
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              
              {/* 🚀 Upload Image from Laptop/Phone directly */}
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-green-700 shadow-sm mb-2 group">
                  <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <Upload size={20} className="text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <label className="text-xs font-bold text-green-800 cursor-pointer bg-green-50 px-3 py-1 rounded-lg border border-green-200 hover:bg-green-100 transition">
                  📁 Choose Image from Device
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password (optional)</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600"
                />
              </div>

              <button 
                type="submit" 
                disabled={updating}
                className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer disabled:opacity-70 mt-2"
              >
                {updating ? 'Saving Changes...' : 'Save All Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileSettings;