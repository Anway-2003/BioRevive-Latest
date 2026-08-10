import 'react';
import { User, Bell, Shield, Users, MapPin, LogOut, Edit3, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Account Settings', icon: User, path: '/settings' },
    { label: 'Notification Settings', icon: Bell, path: '/settings' },
    { label: 'Privacy & Security', icon: Shield, path: '/settings' },
    { label: 'My Groups', icon: Users, path: '/community' },
    { label: 'My Adopted Zones', icon: MapPin, path: '/map' },
  ];

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW (Fkt mobile var disel - block md:hidden) */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
        
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition">
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Profile</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          
          {/* Mobile Profile Card */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-green-700" 
              />
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Anway Yerawar</h2>
                <p className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full inline-block mt-1 uppercase tracking-wide">Eco Champion</p>
              </div>
            </div>
            <button className="bg-gray-50 p-2 rounded-xl text-gray-600 border border-gray-200 shadow-sm active:scale-95 transition">
              <Edit3 size={18} />
            </button>
          </div>

          {/* Mobile Impact Stats (2x2 Grid) */}
          <div>
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3 px-1">Your Impact</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#114A29] mb-1">3</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Zones Adopted</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#114A29] mb-1">42</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Species Returned</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#114A29] mb-1">18.6<span className="text-sm">ha</span></p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Area Restored</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#114A29] mb-1">2.4<span className="text-sm">K</span></p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">CO₂ Saved (kg)</p>
              </div>
            </div>
          </div>

          {/* Mobile Settings Menu */}
          <div>
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3 px-1">Settings</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={idx} 
                    to={item.path}
                    className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition active:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 p-2 rounded-xl text-gray-600">
                        <Icon size={18} />
                      </div>
                      <span className="font-bold text-sm text-gray-800">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Logout Button */}
          <Link 
            to="/auth"
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-extrabold text-sm hover:bg-red-100 transition active:scale-95 shadow-sm border border-red-100"
          >
            <LogOut size={18} /> Log Out
          </Link>

        </div>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW (Tuza Juna Code - hidden md:block) */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Profile & Settings</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your account and preferences</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Profile & Impact Card (Spans 2 cols) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col justify-between">
            <div>
              {/* User Details */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-green-700" 
                  />
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">Anway Yerawar</h2>
                    <p className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full inline-block mt-1">Eco Champion</p>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-green-700 bg-gray-50 hover:bg-green-50 px-4 py-2 rounded-xl transition border border-gray-200">
                  <Edit3 size={14} /> Edit Profile
                </button>
              </div>

              {/* Impact Metrics Inside Profile */}
              <div>
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 uppercase tracking-wider">Your Impact</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-extrabold text-gray-900 mb-1">3</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Zones Adopted</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-extrabold text-gray-900 mb-1">42</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Species Returned</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-extrabold text-gray-900 mb-1">18.6</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Area Restored</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-2xl font-extrabold text-gray-900 mb-1">2.4K kg</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">CO₂ Sequestered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Settings Navigation Menu */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="space-y-2">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={idx} 
                    to={item.path}
                    className="flex items-center justify-between p-3.5 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-400" />
                      {item.label}
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link 
                to="/auth"
                className="flex items-center gap-3 p-3.5 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                Log Out
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProfileSettings;