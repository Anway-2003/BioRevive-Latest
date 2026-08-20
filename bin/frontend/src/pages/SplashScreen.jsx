import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check kar ki user desktop var ahe ki mobile var
    const isDesktop = window.innerWidth >= 768; // 768px chya var asel tar desktop

    if (isDesktop) {
      // Jar Laptop/Web asel tar direct Landing Page var pathav
      navigate('/landing');
    } else {
      // Jar Mobile asel tar 2.5 secondanthun Onboarding var pathav
      const timer = setTimeout(() => {
        navigate('/onboarding');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-[#114A29] flex flex-col justify-between items-center px-6 py-12 text-white font-sans overflow-hidden">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="w-full"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
          <span className="text-4xl">🌱</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">BioRevive</h1>
          <p className="text-sm font-medium text-green-100 tracking-wide">
            Reviving Nature. Restoring Futures.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xs flex flex-col items-center space-y-4">
        <div className="w-36 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full animate-[pulse_1.5s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;