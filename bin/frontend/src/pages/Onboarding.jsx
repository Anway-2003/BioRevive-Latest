import 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between px-6 py-12 font-sans max-w-md mx-auto">
      {/* Top Image / Illustration Placeholder */}
      <div className="flex-1 flex flex-col justify-center items-center text-center mt-8">
        <div className="w-64 h-64 bg-green-50 rounded-3xl flex items-center justify-center mb-8 border border-green-100 shadow-inner">
          <span className="text-7xl">🌳</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Bring Dead Spaces <br /> Back to Life
        </h1>
        <p className="text-sm font-medium text-gray-500 max-w-xs leading-relaxed">
          Detect. Prescribe. Adopt. Measure impact in your city with AI.
        </p>
      </div>

      {/* Bottom Action Button */}
      <div className="w-full mt-8">
        <button
          onClick={() => navigate('/auth')}
          className="w-full py-4 bg-[#114A29] text-white font-extrabold rounded-2xl shadow-lg hover:bg-green-800 transition text-center text-base"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboarding;