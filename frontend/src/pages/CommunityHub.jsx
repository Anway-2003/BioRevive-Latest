import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Plus, Search, Bell, X, Users } from 'lucide-react';
import { supabase } from '../supabaseClient';

const CommunityHub = () => {
  // 1. Dynamic States
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Create Post Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubName, setClubName] = useState('Green Warriors Club');
  const [postAction, setPostAction] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const tabs = [
    { id: 'feed', label: 'Feed' },
    { id: 'my_posts', label: 'My Posts' },
    { id: 'my_teams', label: 'My Teams' }
  ];

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
      const response = await fetch('https://biorevive-backend-6yij.onrender.com/api/community/posts');
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

      await fetch('https://biorevive-backend-6yij.onrender.com/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      }).catch(() => null);

      // Instantly update UI locally
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
    if (activeTab === 'my_posts') return post.club === (userProfile?.full_name || 'Green Warriors Club');
    if (activeTab === 'my_teams') return post.club.includes('Club') || post.club.includes('Foundation');
    return true; // 'feed'
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8 font-sans pb-24 md:pb-8 relative">

      {/* 1. HEADER SECTION */}
      <div className="flex flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">Community Hub</h1>
          <p className="text-xs md:text-sm font-medium text-gray-500">Connect. Collaborate. Create Impact.</p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition shadow-sm cursor-pointer">
            <Search size={20} />
          </button>
          <button className="p-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition shadow-sm relative cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Desktop Create Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-[#114A29] hover:bg-green-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
          >
            <Plus size={18} /> Create Post
          </button>
        </div>
      </div>

      {/* 2. TABS SECTION */}
      <div className="flex overflow-x-auto hide-scrollbar bg-gray-200/60 p-1.5 rounded-2xl mb-8 md:w-max">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-[#114A29] shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="max-w-3xl">
        {loading ? (
          <div className="text-center text-sm font-bold text-gray-400 py-10">Loading community feed...</div>
        ) : filteredPosts.length === 0 ? (
          
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center p-10 min-h-[40vh]">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-5">
              <Users size={36} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">No activities found</h3>
            <p className="text-sm font-medium text-gray-500 max-w-sm mb-8">
              There are no posts available in this filter yet. Be the first to share your environmental impact!
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 w-full max-w-xs bg-[#114A29] hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer"
            >
              <Plus size={20} /> Create New Post
            </button>
          </div>

        ) : (
          
          /* POSTS FEED */
          <div className="space-y-4 md:space-y-6">
            {filteredPosts.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:bg-gray-50/50 transition">
                <div className="flex gap-4 items-start mb-3">
                  <img src={item.avatar} alt={item.club} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-50" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-extrabold text-gray-900">{item.club}</h3>
                      <span className="text-[10px] font-bold text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-1 leading-relaxed">{item.action}</p>
                  </div>
                </div>
                {/* Likes & Comments Footer */}
                <div className="flex items-center gap-6 border-t border-gray-50 pt-3 md:ml-16">
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

        )}
      </div>

      {/* 4. MOBILE FAB (Floating Action Button) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-20 right-5 w-14 h-14 bg-[#114A29] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-green-800 transition z-40 active:scale-95 cursor-pointer"
      >
        <Plus size={28} />
      </button>

      {/* 5. CREATE POST MODAL (Same backend logic as your old code) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-gray-900">Create Community Post</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X size={20} />
              </button>
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