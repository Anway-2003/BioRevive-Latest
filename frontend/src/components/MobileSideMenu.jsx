import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Map, Activity, Leaf, Heart, TrendingUp, FileText, BookOpen, User } from 'lucide-react';

const MobileSideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Zones', icon: Map, path: '/map' },
    { name: 'Analytics', icon: Activity, path: '/ai-analysis' },
    { name: 'Species', icon: Leaf, path: '/species' },
    { name: 'Adopt', icon: Heart, path: '/adopt' },
    { name: 'Impact', icon: TrendingUp, path: '/impact' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Resources', icon: BookOpen, path: '/resources' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const handleNavigation = (path) => {
    setIsOpen(false); // Menu band kar
    navigate(path);   // Exact page var redirect kar
  };

  return (
    <>
      {/* ☰ Hamburger Button (Header madhe) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:bg-white/20 rounded-full transition cursor-pointer md:hidden"
      >
        <Menu size={28} />
      </button>

      {/* 🌑 Background Overlay (Baaher click kelyavar menu band honyasathi) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 📱 Slide-out Menu Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="bg-[#0A2215] p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
            🌱 <span className="text-white">BioRevive</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white p-1 transition cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 hide-scrollbar">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-gray-700 hover:text-[#114A29] hover:bg-green-50 rounded-xl transition cursor-pointer"
                >
                  <Icon size={20} className="text-gray-500" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-200 text-green-800 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div className="text-left">
              <p className="text-sm font-extrabold text-gray-900">Anway</p>
              <p className="text-xs font-bold text-gray-500">Eco Warrior</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSideMenu;