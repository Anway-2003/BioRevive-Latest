import 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Activity, 
  Leaf, 
  HeartHandshake, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  User 
} from 'lucide-react';

const Sidebar = () => {
  // Styling logic for links (Active vs Inactive)
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-3.5 mx-4 rounded-xl font-bold transition-all duration-200 ${
      isActive
        ? 'bg-[#114A29] text-white shadow-lg' 
        : 'text-gray-400 hover:bg-white/5 hover:text-green-400'
    }`;

  return (
    // 🔥 FIX: 'sticky' chya jagi 'fixed top-0 left-0' kela ahe. 
    // Yachyane to gap purnpane nighun jail ani layout flush disel!
    <div className="hidden md:flex w-64 bg-[#0A2215] text-white h-screen shadow-2xl flex-col z-50 fixed top-0 left-0">
      
      {/* Logo Section */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-2 text-green-400 font-extrabold text-2xl tracking-wide">
          🌱 <span className="text-white">BioRevive</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 flex-1 mt-2 overflow-y-auto pb-4">
        <NavLink to="/dashboard" className={linkClasses}>
          <LayoutDashboard size={20} /> 
          Dashboard
        </NavLink>
        <NavLink to="/map" className={linkClasses}>
          <Map size={20} /> 
          Zones
        </NavLink>
        <NavLink to="/ai-analysis" className={linkClasses}>
          <Activity size={20} /> 
          Analytics
        </NavLink>
        <NavLink to="/species" className={linkClasses}>
          <Leaf size={20} /> 
          Species
        </NavLink>
        <NavLink to="/adopt" className={linkClasses}>
          <HeartHandshake size={20} /> 
          Adopt
        </NavLink>
        <NavLink to="/impact" className={linkClasses}>
          <TrendingUp size={20} /> 
          Impact
        </NavLink>
        <NavLink to="/reports" className={linkClasses}>
          <FileText size={20} /> 
          Reports
        </NavLink>
        <NavLink to="/resources" className={linkClasses}>
          <BookOpen size={20} /> 
          Resources
        </NavLink>
        <NavLink to="/profile" className={linkClasses}>
          <User size={20} /> 
          Profile
        </NavLink>
      </nav>

    </div>
  );
};

export default Sidebar;