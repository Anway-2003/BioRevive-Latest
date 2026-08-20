import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Supabase securely updates the password for the current session
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      setSuccess(true);
      // 2 second nantar direct dashboard la pathav
      setTimeout(() => navigate('/dashboard'), 2000); 
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        
        {success ? (
          <div className="py-6">
            <div className="w-16 h-16 bg-green-100 text-[#114A29] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Password Updated!</h2>
            <p className="text-sm font-medium text-gray-500">Your password has been successfully reset. Redirecting you to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-50 text-[#114A29] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Set New Password</h2>
            <p className="text-sm font-medium text-gray-500 mb-8">Please enter your new secure password below.</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-[#114A29] transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#114A29] hover:bg-green-900 text-white font-extrabold py-3.5 rounded-xl transition shadow-md mt-4 cursor-pointer disabled:opacity-70"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
        
      </div>
    </div>
  );
};

export default ResetPassword;