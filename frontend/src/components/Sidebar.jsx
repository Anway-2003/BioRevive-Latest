import 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Map, 
  ShieldAlert, 
  FileText, 
  Users, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  // Styling logic for links (Active vs Inactive)
  // Active state matches the Auth Page's Login button color (#114A29)
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-3.5 mx-4 rounded-xl font-bold transition-all duration-200 ${
      isActive
        ? 'bg-[#114A29] text-white shadow-lg' 
        : 'text-gray-400 hover:bg-white/5 hover:text-green-400'
    }`;

  return (
    // Sidebar Background matches Auth Page Left Panel (#0A2215)
    <div className="w-64 bg-[#0A2215] text-white fixed h-full shadow-2xl flex flex-col z-50">
      
      {/* Logo Section */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-2 text-green-400 font-extrabold text-2xl tracking-wide">
          🌱 <span className="text-white">BioRevive</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 flex-1 mt-4">
        <NavLink to="/dashboard" className={linkClasses}>
          <LayoutDashboard size={20} /> 
          Dashboard
        </NavLink>
        <NavLink to="/map" className={linkClasses}>
          <Map size={20} /> 
          Explore Map
        </NavLink>
        <NavLink to="/analysis" className={linkClasses}>
          <ShieldAlert size={20} /> 
          AI Analysis
        </NavLink>
        <NavLink to="/community" className={linkClasses}>
          <Users size={20} /> 
          Community
        </NavLink>
        <NavLink to="/reports" className={linkClasses}>
          <FileText size={20} /> 
          Reports
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mb-6">
        <div className="border-t border-gray-700/50 mb-4 mx-4"></div>
        <NavLink to="/" className={linkClasses}>
          <Home size={20} /> 
          Landing Page
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          <Settings size={20} /> 
          Settings
        </NavLink>
      </div>
      
    </div>
  );
};

export default Sidebar;