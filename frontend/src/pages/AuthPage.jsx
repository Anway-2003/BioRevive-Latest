import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react'; 
import { supabase } from '../supabaseClient'; // 👈 Supabase client import

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Supabase Auth Handle Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate('/dashboard'); // Success zalyavar dashboard la jail

      } else {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (error) throw error;
        alert('Account created successfully! Please login.');
        setIsLogin(true); // Login tab var switch hoil
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans w-full">
      
      {/* Main Modal Card */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* Left Panel - Dark Green Section */}
        <div className="hidden md:flex flex-col w-2/5 bg-[#0A2215] p-10 text-white relative justify-between">
          <div>
            <div className="flex items-center gap-2 text-green-400 font-bold text-xl mb-12">
              🌱 <span className="text-white">BioRevive</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome Back!</h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-[80%]">
              Login to continue your revival journey.
            </p>
          </div>
          
          {/* Decorative Illustration Area */}
          <div className="relative h-64 w-full flex items-end justify-center mt-8">
            <div className="absolute bottom-0 w-48 h-48 bg-gradient-to-t from-green-800 to-transparent opacity-50 rounded-full blur-2xl"></div>
            <div className="z-10 text-8xl drop-shadow-2xl">🌱</div>
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="w-full md:w-3/5 p-6 pt-14 md:p-12 relative flex flex-col justify-center">
          
          {/* Close Button */}
          <Link to="/" className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-gray-800 bg-gray-50 md:bg-transparent p-1.5 md:p-0 rounded-full transition z-10">
            <X size={24} />
          </Link>

          <div className="max-w-md w-full mx-auto">
            {/* Toggle Switch */}
            <div className="flex bg-gray-50 p-1 rounded-full mb-8 md:mb-10 border border-gray-100">
              <button 
                type="button"
                onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${
                  isLogin ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Login
              </button>
              <button 
                type="button"
                onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${
                  !isLogin ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
              {isLogin ? 'Login to Your Account' : 'Create Your Account'}
            </h2>

            {/* Error Alert Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                  />
                </div>
              )}
              <div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>

            {/* Social Login Separator */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-xs text-gray-400 font-medium">or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4">
              <button type="button" className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition text-gray-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>
              <button type="button" className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </button>
              <button type="button" className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </button>
            </div>

            {/* Bottom Link */}
            <div className="mt-8 text-center text-sm text-gray-500 font-medium">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                className="text-green-700 hover:text-green-900 font-bold transition"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;