import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Map as MapIcon, Activity, CheckCircle, XCircle, Search, TrendingUp, AlertTriangle, LogOut, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { fetchZones, fetchReports } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  
  // Data States
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [reportStatus, setReportStatus] = useState({}); 
  
  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0, 
    totalFunds: 0, 
    criticalZones: 0,
    pendingReports: 0
  });

  useEffect(() => {
    let isMounted = true;

    const loadAdminData = async () => {
      setLoading(true);
      
      try {
        console.log("🟢 Fetching Admin Data...");

        // 1. Fetch Zones safely
        const fetchedZones = await fetchZones() || [];
        
        // 2. Fetch Reports safely
        const fetchedReports = await fetchReports() || [];

        // 3. Fetch Users safely from Supabase
        const { data: profiles, error } = await supabase.from('profiles').select('*');
        if (error) console.error("🔴 Supabase RLS Error:", error);

        if (isMounted) {
          const safeZones = Array.isArray(fetchedZones) ? fetchedZones : [];
          const safeReports = Array.isArray(fetchedReports) ? fetchedReports : [];
          const safeUsers = Array.isArray(profiles) ? profiles : [];

          setZones(safeZones);
          setUsers(safeUsers);

          // Calculate Critical Zones
          const criticalCount = safeZones.filter(z => z?.status === 'Critical').length;

          // Calculate Total ESG Funds
          let totalFundsCalc = 0;
          safeReports.forEach(r => {
            if (r?.description && r.description.includes('[ESG_FUNDING]')) {
              const match = r.description.match(/₹(\d+)/); 
              if (match && match[1]) totalFundsCalc += parseInt(match[1], 10);
            }
          });

          // Handle Verification Status
          const savedStatus = JSON.parse(localStorage.getItem('adminReportStatus')) || {};
          setReportStatus(savedStatus);
          
          const sortedReports = [...safeReports].reverse();
          setReports(sortedReports);

          // Calculate pending verifications
          const pendingCount = sortedReports.filter(r => !savedStatus[r.id]).length;

          setStats({
            totalUsers: safeUsers.length, 
            totalFunds: totalFundsCalc,
            criticalZones: criticalCount,
            pendingReports: pendingCount
          });
        }
      } catch (error) {
        console.error("🔴 Master Admin Fetch Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAdminData();
    return () => { isMounted = false; };
  }, [refreshTrigger]); 

  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleApprove = (reportId) => {
    const newStatus = { ...reportStatus, [reportId]: 'Approved' };
    setReportStatus(newStatus);
    localStorage.setItem('adminReportStatus', JSON.stringify(newStatus));
    setStats(prev => ({ ...prev, pendingReports: Math.max(0, prev.pendingReports - 1) }));
    alert(`Report ID: ${reportId} has been Verified & Approved! ✅`);
  };

  const handleReject = (reportId) => {
    const newStatus = { ...reportStatus, [reportId]: 'Rejected' };
    setReportStatus(newStatus);
    localStorage.setItem('adminReportStatus', JSON.stringify(newStatus));
    setStats(prev => ({ ...prev, pendingReports: Math.max(0, prev.pendingReports - 1) }));
    alert(`Report ID: ${reportId} has been Rejected! ❌`);
  };

  // 🔥 SECURE LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Supabase madhun completely session destroy kara
      navigate('/auth'); // 🚀 Direct Signup/Login page var pathva
    } catch (error) {
      console.error("Error logging out:", error.message);
      alert("Failed to log out. Please try again.");
    }
  };

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-emerald-500/10"><Users size={100} /></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Users</p>
          <h2 className="text-3xl font-black text-slate-800">{loading ? '...' : stats.totalUsers}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-emerald-500/10"><MapIcon size={100} /></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Zones</p>
          <h2 className="text-3xl font-black text-slate-800">{loading ? '...' : zones.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden border-b-4 border-b-amber-500">
          <div className="absolute -right-4 -top-4 text-amber-500/10"><Activity size={100} /></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Verifications</p>
          <h2 className="text-3xl font-black text-slate-800">{loading ? '...' : stats.pendingReports}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden border-b-4 border-b-emerald-500 bg-emerald-50">
          <div className="absolute -right-4 -top-4 text-emerald-500/10"><TrendingUp size={100} /></div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total ESG Funds (₹)</p>
          <h2 className="text-3xl font-black text-emerald-900">{loading ? '...' : stats.totalFunds.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800">Recent Activity Verifications</h3>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">{stats.pendingReports} Pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-bold">Activity Type</th>
                  <th className="px-6 py-4 font-bold">Zone ID</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-400 font-bold">Loading Data...</td></tr>
                ) : reports.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-400 font-bold">No reports found in Java Database.</td></tr>
                ) : reports.slice(0, 10).map((report) => {
                  let displayType = report.actionType || 'Eco Activity';
                  let desc = report.description || '';
                  
                  if (desc.includes('[ESG_FUNDING]')) {
                    displayType = 'ESG Funding';
                    desc = desc.replace('[ESG_FUNDING] ', '');
                  }
                  if (desc.includes('[NGO_DRIVE]')) {
                    displayType = 'Plantation Drive';
                    desc = desc.replace('[NGO_DRIVE] ', '');
                  }

                  const currentStatus = reportStatus[report.id] || 'Pending';

                  return (
                    <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-sm">{displayType}</div>
                        <div className="text-xs text-slate-500 truncate w-48">{desc}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">#{report.zoneId || report.zone_id || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          currentStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                          currentStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {currentStatus === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleApprove(report.id)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition cursor-pointer" title="Approve">
                              <CheckCircle size={18} />
                            </button>
                            <button onClick={() => handleReject(report.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer" title="Reject">
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className={`text-xs font-bold ${currentStatus === 'Approved' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {currentStatus}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={18} /> Critical Zones
            </h3>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto max-h-[500px]">
            {!loading && zones.filter(z => z.status === 'Critical').map(zone => (
              <div key={zone.id} className="bg-white border border-red-200 p-4 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <h4 className="font-bold text-slate-800 text-sm">{zone.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Lat: {zone.latitude?.toFixed(3)}, Lng: {zone.longitude?.toFixed(3)}</p>
                <div className="mt-3 flex gap-2">
                  <button className="text-[10px] font-black uppercase bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                    Assign NGO
                  </button>
                  <button className="text-[10px] font-black uppercase bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition cursor-pointer">
                    Request ESG
                  </button>
                </div>
              </div>
            ))}
            {(!loading && zones.filter(z => z.status === 'Critical').length === 0) && (
              <div className="text-center py-8 text-slate-400 font-bold text-sm">
                No critical zones currently. System healthy. 🌱
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderManageZones = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between">
        <h3 className="font-black text-slate-800">All Database Zones ({zones.length})</h3>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
            <th className="px-6 py-4 font-bold">Zone ID</th>
            <th className="px-6 py-4 font-bold">Zone Name</th>
            <th className="px-6 py-4 font-bold">Coordinates</th>
            <th className="px-6 py-4 font-bold">Current Status</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={zone.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
              <td className="px-6 py-4 font-bold text-slate-600">#{zone.id}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{zone.name}</td>
              <td className="px-6 py-4 text-xs text-slate-500">{zone.latitude?.toFixed(4)}, {zone.longitude?.toFixed(4)}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                  zone.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-200' :
                  zone.status === 'High' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                  zone.status === 'Watch' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                  'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  {zone.status || 'SAFE'}
                </span>
              </td>
            </tr>
          ))}
          {zones.length === 0 && <tr><td colSpan="4" className="text-center py-8 text-slate-400 font-bold">No zones found. Java Backend might be offline.</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-black text-slate-800">Registered Users & NGOs ({users.length})</h3>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
            <th className="px-6 py-4 font-bold">Full Name / Org</th>
            <th className="px-6 py-4 font-bold">Account Role</th>
            <th className="px-6 py-4 font-bold">Impact Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
              <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs">{user.full_name?.charAt(0) || 'U'}</div>
                {user.full_name || 'Anonymous User'}
              </td>
              <td className="px-6 py-4">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide">
                  {user.role || 'Citizen'}
                </span>
              </td>
              <td className="px-6 py-4 font-black text-emerald-600">{user.points || 0} pts</td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan="3" className="text-center py-8 text-slate-400 font-bold">No users loaded. Turn off RLS in Supabase.</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const renderFinances = () => {
    const esgReports = reports.filter(r => r.description?.includes('[ESG_FUNDING]'));
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between border-l-8 border-l-emerald-500">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Corporate ESG Funding Raised</p>
            <h2 className="text-5xl font-black text-emerald-900">₹ {stats.totalFunds.toLocaleString('en-IN')}</h2>
          </div>
          <div className="bg-emerald-50 p-4 rounded-full text-emerald-600"><TrendingUp size={48} /></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-slate-800">Recent Corporate Fundings</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-bold">Transaction Detail</th>
                <th className="px-6 py-4 font-bold">Target Zone</th>
                <th className="px-6 py-4 font-bold">Amount Allocated</th>
              </tr>
            </thead>
            <tbody>
              {esgReports.map(report => {
                const match = report.description?.match(/₹(\d+)/);
                const amount = match && match[1] ? parseInt(match[1], 10) : 0;
                
                return (
                  <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                      {report.description.replace('[ESG_FUNDING] ', '')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600">Zone #{report.zoneId || report.zone_id || 'N/A'}</td>
                    <td className="px-6 py-4 font-black text-lg text-emerald-600">₹ {amount.toLocaleString('en-IN')}</td>
                  </tr>
                )
              })}
              {esgReports.length === 0 && <tr><td colSpan="3" className="text-center py-8 text-slate-400 font-bold">No ESG funds recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden w-full absolute top-0 left-0 z-50">
      
      {/* 🚀 ADMIN SIDEBAR */}
      <div className="w-64 bg-[#0B1521] text-slate-300 flex flex-col justify-between shadow-2xl z-20 shrink-0">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="bg-emerald-500 p-2 rounded-lg text-[#0B1521]">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-lg tracking-wide">Admin Portal</h2>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">BioRevive Command</p>
            </div>
          </div>
          
          <div className="p-4 space-y-2 mt-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition cursor-pointer ${activeTab === 'overview' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Activity size={18} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('zones')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition cursor-pointer ${activeTab === 'zones' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <MapIcon size={18} /> Manage Zones
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition cursor-pointer ${activeTab === 'users' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Users size={18} /> Users & NGOs
            </button>
            <button 
              onClick={() => setActiveTab('finances')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition cursor-pointer border border-transparent ${activeTab === 'finances' ? 'bg-transparent border-slate-700 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <TrendingUp size={18} /> ESG Finances
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          {/* 🔥 LOGOUT BUTTON UPDATED */}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-3 rounded-xl font-bold transition cursor-pointer border border-transparent hover:border-red-500/50">
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </div>

      {/* 🚀 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header */}
        <header className="bg-white px-8 py-5 border-b border-slate-200 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200 focus-within:border-emerald-500 transition">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search reports, users, or zones..." className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-full" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleManualRefresh} className="p-2 bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 rounded-full transition cursor-pointer" title="Refresh Data">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <span className="text-sm font-bold text-slate-500">System Status: <span className="text-emerald-500">Online</span></span>
            <div className="w-10 h-10 bg-[#0B1521] rounded-full flex items-center justify-center text-white border-2 border-emerald-500 shadow-md">
              <Shield size={18} />
            </div>
          </div>
        </header>

        {/* Dynamic Content Based on Tab */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800">
              {activeTab === 'overview' && 'Command Center'}
              {activeTab === 'zones' && 'Zone Management'}
              {activeTab === 'users' && 'User Directory'}
              {activeTab === 'finances' && 'ESG Financial Records'}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {activeTab === 'overview' && 'Monitor and verify platform activities across all roles.'}
              {activeTab === 'zones' && 'Track and update real-time zones from Java Database.'}
              {activeTab === 'users' && 'View all registered Citizens, NGOs, and Corporates.'}
              {activeTab === 'finances' && 'Track Corporate ESG funding and allocations.'}
            </p>
          </div>

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'zones' && renderManageZones()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'finances' && renderFinances()}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;