import 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav'; // Mobile Bottom Bar
import SplashScreen from './pages/SplashScreen'; // Screen 1
import Onboarding from './pages/Onboarding';   // Screen 2
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import AdminDashboard from './pages/AdminDashboard';
import ResetPassword from './pages/ResetPassword';

import ZoneDetails from './pages/ZoneDetails';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AIAnalysis from './pages/AIAnalysis';
import AIRevivalPlan from './pages/AIRevivalPlan'; 
import Reports from './pages/Reports';
import Resources from './pages/Resources';
import NativeSpecies from './pages/NativeSpecies';
import AdoptZone from './pages/AdoptZone';
import UploadCapture from './pages/UploadCapture';
import CommunityHub from './pages/CommunityHub';
import ImpactTracker from './pages/ImpactTracker';
import ProfileSettings from './pages/ProfileSettings';

// Layout Wrapper: Web sathi Sidebar, Mobile sathi BottomNav
const Layout = ({ children }) => {
  const location = useLocation();
  
  // 🔥 FIX: /admin ani /reset-password la list madhe add kela 
  const hideNavRoutes = ['/', '/onboarding', '/auth', '/landing', '/admin', '/reset-password'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans pb-16 md:pb-0">
      
      {/* 💻 Desktop/Web View: Sidebar fkt laptop var disel */}
      {!shouldHideNav && (
        <div className="hidden md:block">
          <Sidebar />
        </div>
      )}
      
      {/* Main Content Area (Mobile var full width, Laptop var sidebar sodun pudhe) */}
      <div className={!shouldHideNav ? "md:ml-64 flex-1 w-full" : "flex-1 w-full"}>
        {children}
      </div>

      {/* 📱 Mobile View: Bottom Navigation fkt phone/small screen var disel */}
      {!shouldHideNav && (
        <div className="block md:hidden">
          <BottomNav />
        </div>
      )}
      
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Mobile Flow */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Core App & Web Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* 🔥 MAIN SIDEBAR LINKING FIXED HERE 🔥 */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/species" element={<NativeSpecies />} />
          <Route path="/adopt" element={<AdoptZone />} />
          <Route path="/adopt/:id" element={<AdoptZone />} />
          <Route path="/impact" element={<ImpactTracker />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<ProfileSettings />} />

          {/* Hidden/Internal Pages (Open on specific button clicks) */}
          <Route path="/zone/:id" element={<ZoneDetails />} />
          <Route path="/revival-plan" element={<AIRevivalPlan />} />
          <Route path="/upload" element={<UploadCapture />} />
          <Route path="/community" element={<CommunityHub />} />
		      <Route path="/admin" element={<AdminDashboard />} />
		      <Route path="/reset-password" element={<ResetPassword />} />

          {/* Fallback */}
          <Route path="*" element={<SplashScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;