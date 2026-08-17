import 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, PlusCircle, Users, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/auth') {
    return null;
  }

  const navItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Map', icon: Map, path: '/map' },
    { label: 'Capture', icon: PlusCircle, path: '/upload', isAction: true },
    { label: 'Activity', icon: Users, path: '/community' },
    { label: 'Profile', icon: User, path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50 shadow-lg md:max-w-md md:mx-auto">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        if (item.isAction) {
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="bg-[#114A29] text-white p-3 rounded-full shadow-md -mt-5 hover:bg-green-800 transition flex items-center justify-center"
            >
              <Icon size={24} />
            </button>
          );
        }

        return (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition ${
              isActive ? 'text-[#114A29]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;