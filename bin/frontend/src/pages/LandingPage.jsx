import 'react';
import { Link } from 'react-router-dom';
// Step 1: Ithe tuzi image import kar (path check karun ghetla ahe)
import heroBg from '../assets/herobg.jpeg'; 

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white overflow-x-hidden">
      {/* 1. Navigation Bar */}
      <nav className="flex justify-between items-center px-4 md:px-8 py-3 bg-white border-b border-gray-100 z-20">
        {/* Logo */}
        <div className="flex items-center bg-[#114A29] text-white px-6 py-3 -ml-4 md:-ml-8 rounded-r-xl shadow-sm">
          <span className="font-extrabold text-xl tracking-wide flex items-center gap-2">
            🌱 BioRevive
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
          <a href="#" className="hover:text-green-700 transition">Home</a>
          <a href="#" className="hover:text-green-700 transition">About</a>
          <a href="#" className="hover:text-green-700 transition">Features</a>
          <a href="#" className="hover:text-green-700 transition">Impact</a>
          <a href="#" className="hover:text-green-700 transition">Resources</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-3 items-center text-sm font-bold">
          <Link to="/auth" className="text-gray-600 hover:text-green-700 transition border border-gray-200 px-5 py-2 rounded-lg bg-white flex items-center justify-center">
            Login
          </Link>
          <Link to="/auth" className="bg-[#114A29] text-white px-5 py-2 rounded-lg hover:bg-green-800 transition shadow-sm border border-green-700 flex items-center justify-center">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section (Using Local Imported Image) */}
      <div 
        className="relative flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 bg-cover bg-center min-h-[550px]"
        style={{ 
          // Step 2: Ithe variable pass kela ahe
          backgroundImage: `url(${heroBg})` 
        }}
      >
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-0"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl text-white mt-4 mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            Turning Dead Spaces <br /> into Living Ecosystems
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-xl font-medium leading-relaxed">
            AI-powered platform to detect biodiversity dead zones and revive them with native species.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/map" className="px-8 py-3.5 bg-[#114A29] text-white text-center font-bold rounded-xl hover:bg-green-700 transition shadow-lg border border-green-600">
              Explore Map
            </Link>
            <button className="px-8 py-3.5 bg-white text-gray-900 text-center font-bold rounded-xl hover:bg-gray-100 transition shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* 3. Impact Statistics Bar */}
      <div className="bg-white py-8 z-10 relative shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-200">
          <div className="px-4">
            <p className="text-4xl font-extrabold text-[#114A29] mb-2">1,246</p>
            <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Dead Zones Detected</p>
          </div>
          <div className="px-4">
            <p className="text-4xl font-extrabold text-[#114A29] mb-2">2,845</p>
            <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Active Community</p>
          </div>
          <div className="px-4">
            <p className="text-4xl font-extrabold text-[#114A29] mb-2">18.6 ha</p>
            <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Area Restored</p>
          </div>
          <div className="px-4">
            <p className="text-4xl font-extrabold text-[#114A29] mb-2">2.4K kg</p>
            <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">CO₂ Sequestered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;