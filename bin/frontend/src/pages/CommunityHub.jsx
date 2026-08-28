import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Plus, Search, Bell, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const CommunityHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Post Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubName, setClubName] = useState('Green Warriors Club');
  const [postAction, setPostAction] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // 🚀 Fetch Real Posts from Java Backend & Supabase User
  const fetchCommunityPosts = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) setUserProfile(profile);
      }

      // Fetch from Java Spring Boot Backend
      const response = await fetch('http://https://biorevive-backend-6yij.onrender.com/api/community/posts');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setPosts(data);
          return;
        }
      }

      // Fallback initial data if server table is empty
      setPosts([
        {
          id: 1,
          club: 'Green Warriors Club',
          action: 'Adopted Wagholi Dumping Ground. We are starting the soil remediation process this weekend. Who wants to join?',
          time: '3 hours ago',
          likes: 12,
          comments: 3,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
        },
        {
          id: 2,
          club: 'Pune Eco Club',
          action: 'Planted 25 native trees at Hinjewadi IT Park. The soil moisture levels are looking great after the initial prep!',
          time: '1 day ago',
          likes: 18,
          comments: 5,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80'
        }
      ]);
    } catch (error) {
      console.error("Error fetching community posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  // 🚀 Handle Create New Post (Java Backend Sync)
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postAction.trim()) return;

    setSubmitting(true);
    try {
      const newPost = {
        club: clubName,
        action: postAction,
        time: 'Just now',
        likes: 0,
        comments: 0,
        avatar: userProfile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
      };

      const response = await fetch('http://https://biorevive-backend-6yij.onrender.com/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      }).catch(() => null);

      // Instantly update UI locally even if backend endpoint is still pending configuration
      setPosts(prev => [newPost, ...prev]);
      setIsModalOpen(false);
      setPostAction('');
    } catch (err) {
      console.error("Error saving post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter posts based on tab selection
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'my_activities') return post.club === (userProfile?.full_name || 'Green Warriors Club');
    if (activeTab === 'my_group') return post.club.includes('Club') || post.club.includes('Foundation');
    return true; // 'all'
  });

  return (
    <div className="w-full">
      
      {/* 📱 1. MOBILE APP VIEW */}
      <div className="block md:hidden min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
        <div className="bg-white px-4 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Community</h1>
            <p className="text-[11px] font-bold text-gray-500">Connect & Collaborate</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition"><Search size={20} /></button>
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition relative"><Bell size={20} /><span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span></button>
          </div>
        </div>

        <div className="bg-white px-4 shadow-sm border-b border-gray-100 flex gap-4 overflow-x-auto custom-scrollbar sticky top-[68px] z-10">
          {[
            { id: 'all', label: 'Feed' },
            { id: 'my_activities', label: 'My Posts' },
            { id: 'my_group', label: 'My Teams' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs font-extrabold whitespace-nowrap border-b-[3px] transition-all cursor-pointer ${
                activeTab === tab.id ? 'border-[#114A29] text-[#114A29]' : 'border-transparent text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-center text-xs font-bold text-gray-400 mt-10">Loading community feed...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-xs font-bold text-gray-400 mt-10">No activities found in this filter.</div>
          ) : filteredPosts.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex gap-3 items-center mb-3">
                <img src={item.avatar} alt={item.club} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-50" />
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">{item.club}</h3>
                  <p className="text-[10px] text-gray-400 font-bold">{item.time}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-4 leading-relaxed">{item.action}</p>
              <div className="flex items-center gap-6 border-t border-gray-50 pt-3">
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 transition cursor-pointer">
                  <Heart size={16} className="text-red-500 fill-red-500" /> {item.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer">
                  <MessageSquare size={16} /> {item.comments}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setIsModalOpen(true)} className="fixed bottom-[85px] right-5 bg-[#114A29] text-white p-4 rounded-full shadow-xl hover:bg-green-800 transition active:scale-90 z-30 flex items-center justify-center cursor-pointer">
          <Plus size={24} />
        </button>
      </div>


      {/* 💻 2. DESKTOP / WEB VIEW */}
      <div className="hidden md:block p-8 bg-[#F8FAFC] min-h-screen font-sans w-full">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Community Hub</h1>
            <p className="text-xs font-bold text-gray-400">Connect. Collaborate. Create Impact via Java Database.</p>
          </div>

          <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100 max-w-md">
            {[
              { id: 'all', label: 'All Activities' },
              { id: 'my_activities', label: 'My Activities' },
              { id: 'my_group', label: 'My Group' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            {loading ? (
              <div className="text-center text-sm font-bold text-gray-400 py-10">Loading community activities...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center text-sm font-bold text-gray-400 py-10">No posts available. Be the first to share!</div>
            ) : filteredPosts.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-gray-100 hover:bg-gray-50/50 transition flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} alt={item.club} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-sm mb-0.5">{item.club}</h3>
                    <p className="text-xs font-medium text-gray-600 mb-1">{item.action}</p>
                    <span className="text-[11px] font-bold text-gray-400">{item.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-1.5"><Heart size={16} className="text-red-500 fill-red-500" /><span>{item.likes}</span></div>
                  <div className="flex items-center gap-1.5"><MessageSquare size={16} className="text-gray-400" /><span>{item.comments}</span></div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer">
            <Plus size={18} /> Create New Post
          </button>

        </div>
      </div>

      {/* 🚀 CREATE POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900">Create Community Post</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Club / Entity Name</label>
                <input 
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">What's happening in your zone?</label>
                <textarea 
                  rows="4"
                  value={postAction}
                  onChange={(e) => setPostAction(e.target.value)}
                  placeholder="Share your cleanup or soil remediation progress..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-green-600 resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer disabled:opacity-70"
              >
                {submitting ? 'Publishing to Database...' : 'Publish Post'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityHub;