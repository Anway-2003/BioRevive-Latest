import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ArrowLeft, MailCheck } from 'lucide-react'; 
import { supabase } from '../supabaseClient'; 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); 
  const [resetEmailSent, setResetEmailSent] = useState(false); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // 🚀 Standard Email/Password Auth Handle Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate('/dashboard'); // Success zalyavar dashboard la jail

      } else {
        // --- SIGN UP LOGIC ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (error) throw error;
        alert('Account created successfully! Please login.');
        switchTab(true); // Login tab var switch hoil
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Forgot Password Logic (Sends OTP / Reset Link to Email)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`, 
      });
      
      if (error) throw error;
      setResetEmailSent(true); // Show success UI
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Google OAuth Auth Handle Function (Updated with select_account prompt)
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          // 🔥 ITHHE CHANGE KELA AHE: Force Google to show account selection screen
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err.message || 'Google Login failed.');
    }
  };

  // Helper to cleanly switch tabs
  const switchTab = (toLogin) => {
    setIsLogin(toLogin);
    setIsForgotPassword(false);
    setResetEmailSent(false);
    setErrorMsg('');
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
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              {isForgotPassword ? 'Reset Password' : 'Welcome Back!'}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-[80%]">
              {isForgotPassword 
                ? 'We will send a secure link to your email to get you back into your account.' 
                : 'Login to continue your revival journey.'}
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
            
            {/* Toggle Switch (Hidden during Forgot Password flow) */}
            {!isForgotPassword && (
              <div className="flex bg-gray-50 p-1 rounded-full mb-8 md:mb-10 border border-gray-100">
                <button 
                  type="button"
                  onClick={() => switchTab(true)}
                  className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${
                    isLogin ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Login
                </button>
                <button 
                  type="button"
                  onClick={() => switchTab(false)}
                  className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${
                    !isLogin ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Error Alert Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* 🚀 FORGOT PASSWORD VIEW */}
            {isForgotPassword ? (
              resetEmailSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-[#114A29] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailCheck size={32} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Check Your Email</h2>
                  <p className="text-sm font-medium text-gray-500 mb-8">
                    We've sent a secure password reset link to <br/><span className="font-bold text-gray-800">{email}</span>
                  </p>
                  <button 
                    onClick={() => switchTab(true)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl transition cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="mb-6">
                    <button 
                      type="button" 
                      onClick={() => switchTab(true)} 
                      className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-800 transition mb-6 cursor-pointer"
                    >
                      <ArrowLeft size={16} /> Back to login
                    </button>
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Reset Password</h2>
                    <p className="text-xs font-medium text-gray-500">Enter your email address and we'll send you a secure link to reset your password.</p>
                  </div>
                  
                  <div>
                    <input 
                      type="email" 
                      placeholder="Enter your registered email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-4 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Secure Reset Link'}
                  </button>
                </form>
              )
            ) : (
              /* 🚀 STANDARD LOGIN / SIGN UP VIEW */
              <>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
                  {isLogin ? 'Login to Your Account' : 'Create Your Account'}
                </h2>

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
                    
                    {/* 🚀 Forgot Password Link */}
                    {isLogin && (
                      <div className="flex justify-end mt-2">
                        <button 
                          type="button" 
                          onClick={() => { setIsForgotPassword(true); setErrorMsg(''); }}
                          className="text-xs font-bold text-[#114A29] hover:underline cursor-pointer transition"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                  </button>
                </form>

                {/* Social Login Separator */}
                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="px-4 text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* 🚀 Single Clean Google Button */}
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl transition shadow-sm cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.806L1.24 17.35C3.198 21.302 7.269 24 12 24c3.24 0 5.966-1.08 7.962-2.916l-3.922-3.071Z"/>
                    <path fill="#4A90E2" d="M23.606 12.273c0-.922-.085-1.812-.244-2.673H12v5.454h6.57c-.29 1.76-1.328 3.245-2.825 4.197l3.921 3.071c2.294-2.115 3.614-5.227 3.614-8.049Z"/>
                    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.35l4.04-3.082Z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Bottom Link */}
                <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    type="button"
                    onClick={() => switchTab(!isLogin)}
                    className="text-green-700 hover:text-green-900 font-bold transition cursor-pointer"
                  >
                    {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;